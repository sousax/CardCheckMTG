import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import sinon from 'sinon'

import { UserFactory } from '#users/database/factories/user'
import { assertForbiddenRedirect } from '#tests/helpers/http'

import { DeckFactory } from '#decks/database/factories/deck'
import Deck from '#decks/models/deck'
import Scryfall from '#decks/services/scryfall'

test.group('Endpoint /decks', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  // Never reach Scryfall from tests; specific tests override the stub.
  group.each.setup(() => {
    sinon.stub(Scryfall.prototype, 'lookup').resolves(null)
  })
  group.each.teardown(() => sinon.restore())

  test('GET /decks sem auth redireciona para login', async ({ client, assert }) => {
    const response = await client.get('/decks').redirects(0)
    response.assertStatus(302)
    assert.equal(response.header('location'), '/login')
  })

  test('GET /decks sem decks renderiza o estado vazio', async ({ client }) => {
    const user = await UserFactory.create()

    const response = await client.get('/decks').loginAs(user).withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('decks/index')
  })

  test('GET /decks mostra a visao geral com resumo e lista de compras', async ({
    client,
    assert,
  }) => {
    const user = await UserFactory.create()
    const ninjas = await DeckFactory.merge({ userId: user.id, name: 'Ninjas' }).create()
    const burn = await DeckFactory.merge({ userId: user.id, name: 'Burn' }).create()
    await ninjas.related('cards').createMany([
      { name: 'Yuriko', quantity: 1, owned: false, category: 'creatures', colorIdentity: 'UB' },
      { name: 'Sol Ring', quantity: 1, owned: false, category: 'artifacts', colorIdentity: '' },
      { name: 'Island', quantity: 10, owned: true, category: 'lands', colorIdentity: '' },
    ])
    await burn.related('cards').createMany([
      { name: 'Sol Ring', quantity: 1, owned: false, category: 'artifacts', colorIdentity: null },
      { name: 'Shock', quantity: 4, owned: false, category: 'instants', colorIdentity: null },
    ])
    await DeckFactory.with('user').with('cards', 1).create()

    const response = await client.get('/decks').loginAs(user).withInertia()

    response.assertInertiaComponent('decks/index')
    const props = response.inertiaProps as {
      decks: {
        name: string
        featured: string
        total: number
        owned: number
        colors: string | null
      }[]
      shoppingList: { name: string; quantity: number; decks: string[] }[]
    }
    assert.deepEqual(
      props.decks.map((d) => [d.name, d.featured, d.total, d.owned, d.colors]),
      [
        ['Ninjas', 'Yuriko', 12, 10, 'UB'],
        // No colour data at all stays unknown instead of claiming colourless.
        ['Burn', 'Sol Ring', 5, 0, null],
      ]
    )
    // Sol Ring is missing from both decks, so it leads the list.
    assert.deepEqual(props.shoppingList, [
      { name: 'Sol Ring', scryfallId: null, quantity: 2, decks: ['Ninjas', 'Burn'] },
      { name: 'Shock', scryfallId: null, quantity: 4, decks: ['Burn'] },
      { name: 'Yuriko', scryfallId: null, quantity: 1, decks: ['Ninjas'] },
    ])
  })

  test('GET /decks/:id mostra o deck e so as abas do dono', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const deck = await DeckFactory.merge({ userId: user.id }).with('cards', 2).create()
    await DeckFactory.with('user').create()

    const response = await client.get(`/decks/${deck.id}`).loginAs(user).withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('decks/show')
    const props = response.inertiaProps as {
      decks: { id: number }[]
      deck: { id: number; cards: unknown[] }
    }
    assert.deepEqual(
      props.decks.map((d) => d.id),
      [deck.id]
    )
    assert.equal(props.deck.id, deck.id)
    assert.lengthOf(props.deck.cards, 2)
  })

  test('GET /decks/:id de outro usuario eh barrado', async ({ client }) => {
    const user = await UserFactory.create()
    const alheio = await DeckFactory.with('user').create()

    const response = await client.get(`/decks/${alheio.id}`).loginAs(user).redirects(0)

    assertForbiddenRedirect(response)
  })

  test('POST /decks importa a lista e redireciona para o deck', async ({ client, assert }) => {
    sinon.restore()
    sinon.stub(Scryfall.prototype, 'lookup').resolves({
      typeLines: new Map([['lightning bolt', 'Instant']]),
      colors: new Map([['lightning bolt', 'R']]),
      ids: new Map(),
      notFound: new Set(),
    })
    const user = await UserFactory.create()

    const response = await client
      .post('/decks')
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .json({ decklist: '4 Lightning Bolt\n20 Mountain', name: 'Burn' })

    const deck = await Deck.query().where('user_id', user.id).preload('cards').firstOrFail()
    response.assertStatus(302)
    assert.equal(response.header('location'), `/decks/${deck.id}`)
    assert.equal(deck.name, 'Burn')
    assert.sameDeepMembers(
      deck.cards.map((c) => [c.name, c.quantity, c.category]),
      [
        ['Lightning Bolt', 4, 'instants'],
        ['Mountain', 20, 'lands'],
      ]
    )
  })

  test('POST /decks sem nome usa o nome padrao', async ({ client, assert }) => {
    const user = await UserFactory.create()

    await client
      .post('/decks')
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .json({ decklist: '1 Sol Ring' })

    const deck = await Deck.findByOrFail('user_id', user.id)
    assert.isNotEmpty(deck.name)
  })

  test('POST /decks rejeita lista sem cartas reconheciveis (422)', async ({ client, assert }) => {
    const user = await UserFactory.create()

    const response = await client
      .post('/decks')
      .loginAs(user)
      .withCsrfToken()
      .accept('json')
      .redirects(0)
      .json({ decklist: 'isso nao eh uma decklist' })

    response.assertStatus(422)
    assert.equal(response.body().errors[0].field, 'decklist')
    assert.isNull(await Deck.findBy('user_id', user.id))
  })

  test('DELETE /decks/:id remove o proprio deck e as cartas', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const deck = await DeckFactory.merge({ userId: user.id }).with('cards', 2).create()

    const response = await client
      .delete(`/decks/${deck.id}`)
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)

    response.assertStatus(302)
    assert.equal(response.header('location'), '/decks')
    assert.isNull(await Deck.find(deck.id))
  })

  test('DELETE /decks/:id de outro usuario eh barrado', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const alheio = await DeckFactory.with('user').create()

    const response = await client
      .delete(`/decks/${alheio.id}`)
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)

    assertForbiddenRedirect(response)
    assert.isNotNull(await Deck.find(alheio.id))
  })
})
