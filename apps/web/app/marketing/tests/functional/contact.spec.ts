import emitter from '@adonisjs/core/services/emitter'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import sinon from 'sinon'

import ContactMessage from '#marketing/models/contact_message'
import Turnstile from '#marketing/services/turnstile'

const valid = {
  'name': 'Jace Beleren',
  'email': 'jace@example.test',
  'message': 'Adorei o app, parabéns!',
  'cf-turnstile-response': 'token',
}

async function countMessages() {
  const row = await ContactMessage.query().count('* as total').first()
  return Number(row?.$extras.total)
}

test.group('Endpoint POST /contact', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  let fake: ReturnType<typeof emitter.fake>
  group.each.setup(() => {
    fake = emitter.fake(['contact:received'])
    // Never reach Cloudflare from tests; specific tests override the stub.
    sinon.stub(Turnstile.prototype, 'verify').resolves(true)
    return () => {
      emitter.restore()
      sinon.restore()
    }
  })

  test('salva a mensagem e emite o evento do e-mail', async ({ client, assert }) => {
    const response = await client.post('/contact').redirects(0).withCsrfToken().json(valid)

    response.assertStatus(302)
    fake.assertEmitted('contact:received')
    const saved = await ContactMessage.findByOrFail('email', valid.email)
    assert.equal(saved.message, valid.message)
  })

  test('captcha recusado nao salva nada', async ({ client, assert }) => {
    sinon.restore()
    sinon.stub(Turnstile.prototype, 'verify').resolves(false)

    const response = await client.post('/contact').redirects(0).withCsrfToken().json(valid)

    response.assertStatus(302)
    fake.assertNotEmitted('contact:received')
    assert.equal(await countMessages(), 0)
  })

  test('sem token do captcha nao salva nada', async ({ client, assert }) => {
    const { 'cf-turnstile-response': token, ...withoutToken } = valid
    assert.isString(token)
    const response = await client.post('/contact').redirects(0).withCsrfToken().json(withoutToken)

    response.assertStatus(302)
    fake.assertNotEmitted('contact:received')
    assert.equal(await countMessages(), 0)
  })

  test('teto diario recusa a mensagem 51', async ({ client, assert }) => {
    await ContactMessage.createMany(
      Array.from({ length: 50 }, (_, i) => ({
        name: 'Bot',
        email: `b${i}@x.test`,
        message: 'flood flood',
      }))
    )

    const response = await client.post('/contact').redirects(0).withCsrfToken().json(valid)

    response.assertStatus(302)
    fake.assertNotEmitted('contact:received')
    assert.equal(await countMessages(), 50)
  })

  test('honeypot preenchido responde igual mas nao salva nada', async ({ client, assert }) => {
    const response = await client
      .post('/contact')
      .redirects(0)
      .withCsrfToken()
      .json({ ...valid, website: 'https://spam.example' })

    response.assertStatus(302)
    fake.assertNotEmitted('contact:received')
    assert.isNull(await ContactMessage.findBy('email', valid.email))
  })

  test('valida os campos', async ({ client, assert }) => {
    const response = await client
      .post('/contact')
      .redirects(0)
      .withCsrfToken()
      .json({ name: '', email: 'nao-e-email', message: 'curta' })

    response.assertStatus(302)
    fake.assertNotEmitted('contact:received')
    assert.equal(await countMessages(), 0)
  })
})
