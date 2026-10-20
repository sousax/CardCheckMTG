import Factory from '@adonisjs/lucid/factories'

import { UserFactory } from '#users/database/factories/user'

import Deck from '#decks/models/deck'
import DeckCard from '#decks/models/deck_card'

export const DeckCardFactory = Factory.define(DeckCard, ({ faker }) => {
  return {
    name: `${faker.lorem.word()} ${faker.string.alphanumeric(8)}`,
    quantity: faker.number.int({ min: 1, max: 4 }),
    owned: false,
    category: 'creatures' as const,
    notFound: false,
  }
}).build()

export const DeckFactory = Factory.define(Deck, ({ faker }) => {
  return {
    name: faker.lorem.words(2),
  }
})
  .relation('user', () => UserFactory)
  .relation('cards', () => DeckCardFactory)
  .build()
