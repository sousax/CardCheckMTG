import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

import { UserFactory } from '#users/database/factories/user'

test.group('Marketing index', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('GET / sem auth renderiza a landing page', async ({ client }) => {
    const response = await client.get('/').withInertia()
    response.assertStatus(200)
    response.assertInertiaComponent('marketing/index')
  })

  test('GET / autenticado vai para /decks', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const response = await client.get('/').loginAs(user).redirects(0)
    response.assertStatus(302)
    assert.equal(response.header('location'), '/decks')
  })
})
