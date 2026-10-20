import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

import { UserFactory } from '#users/database/factories/user'
import { assertForbiddenRedirect } from '#tests/helpers/http'

import { DeckFactory } from '#decks/database/factories/deck'
import DeckCard from '#decks/models/deck_card'

test.group('Endpoint PATCH /decks/:deck_id/cards/:id', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('marca carta como tenho', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const deck = await DeckFactory.merge({ userId: user.id }).with('cards', 1).create()
    const [card] = deck.cards

    const response = await client
      .patch(`/decks/${deck.id}/cards/${card.id}`)
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .json({ owned: true })

    response.assertStatus(302)
    await card.refresh()
    assert.isTrue(card.owned)
  })

  test('corrige a categoria', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const deck = await DeckFactory.merge({ userId: user.id }).with('cards', 1).create()
    const [card] = deck.cards

    await client
      .patch(`/decks/${deck.id}/cards/${card.id}`)
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .json({ category: 'lands' })

    await card.refresh()
    assert.equal(card.category, 'lands')
    assert.isFalse(card.owned)
  })

  test('rejeita categoria invalida (422)', async ({ client }) => {
    const user = await UserFactory.create()
    const deck = await DeckFactory.merge({ userId: user.id }).with('cards', 1).create()

    const response = await client
      .patch(`/decks/${deck.id}/cards/${deck.cards[0].id}`)
      .loginAs(user)
      .withCsrfToken()
      .accept('json')
      .redirects(0)
      .json({ category: 'tokens' })

    response.assertStatus(422)
  })

  test('carta de outro usuario eh barrada', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const alheio = await DeckFactory.with('user').with('cards', 1).create()
    const [card] = alheio.cards

    const response = await client
      .patch(`/decks/${alheio.id}/cards/${card.id}`)
      .loginAs(user)
      .withCsrfToken()
      .redirects(0)
      .json({ owned: true })

    assertForbiddenRedirect(response)
    const unchanged = await DeckCard.findOrFail(card.id)
    assert.isFalse(unchanged.owned)
  })

  test('carta que nao pertence ao deck da URL da 404', async ({ client }) => {
    const user = await UserFactory.create()
    const meu = await DeckFactory.merge({ userId: user.id }).create()
    const alheio = await DeckFactory.with('user').with('cards', 1).create()

    const response = await client
      .patch(`/decks/${meu.id}/cards/${alheio.cards[0].id}`)
      .loginAs(user)
      .withCsrfToken()
      .accept('json')
      .redirects(0)
      .json({ owned: true })

    response.assertStatus(404)
  })
})
