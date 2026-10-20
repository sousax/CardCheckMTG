import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import sinon from 'sinon'

import { UserFactory } from '#users/database/factories/user'

import ImportDeck from '#decks/actions/import_deck'
import Scryfall from '#decks/services/scryfall'

test.group('ImportDeck', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.teardown(() => sinon.restore())

  test('cria deck com categorias vindas da Scryfall', async ({ assert }) => {
    const owner = await UserFactory.create()
    const scryfall = new Scryfall()
    sinon.stub(scryfall, 'lookup').resolves({
      typeLines: new Map([
        ['lightning bolt', 'Instant'],
        ['monastery swiftspear', 'Creature — Human Monk'],
      ]),
      colors: new Map([
        ['lightning bolt', 'R'],
        ['monastery swiftspear', 'R'],
      ]),
      notFound: new Set(['carta inventada']),
    })

    const deck = await new ImportDeck(scryfall).handle({
      owner,
      name: 'Burn',
      decklist: '4 Lightning Bolt\n4 Monastery Swiftspear\n1 Carta Inventada',
    })

    await deck.load('cards', (q) => q.orderBy('id'))
    assert.equal(deck.userId, owner.id)
    assert.equal(deck.name, 'Burn')
    assert.deepEqual(
      deck.cards.map((c) => [c.name, c.quantity, c.category, c.notFound, c.owned, c.colorIdentity]),
      [
        ['Lightning Bolt', 4, 'instants', false, false, 'R'],
        ['Monastery Swiftspear', 4, 'creatures', false, false, 'R'],
        ['Carta Inventada', 1, 'other', true, false, null],
      ]
    )
  })

  test('sem Scryfall cai na tabela local', async ({ assert }) => {
    const owner = await UserFactory.create()
    const scryfall = new Scryfall()
    sinon.stub(scryfall, 'lookup').resolves(null)

    const deck = await new ImportDeck(scryfall).handle({
      owner,
      name: 'Ninjas',
      decklist: '1 Ninja of the Deep Hours\n10 Island',
    })

    await deck.load('cards', (q) => q.orderBy('id'))
    assert.deepEqual(
      deck.cards.map((c) => [c.name, c.category, c.notFound]),
      [
        ['Ninja of the Deep Hours', 'creatures', false],
        ['Island', 'lands', false],
      ]
    )
  })
})
