import db from '@adonisjs/lucid/services/db'

import type User from '#users/models/user'

import Deck from '#decks/models/deck'
import { categoryFromName, categoryFromTypeLine } from '#decks/services/card_categories'
import { parseDecklist } from '#decks/services/decklist_parser'
import Scryfall from '#decks/services/scryfall'

export interface ImportDeckInput {
  owner: User
  decklist: string
  name: string
}

export default class ImportDeck {
  constructor(private scryfall = new Scryfall()) {}

  async handle(input: ImportDeckInput): Promise<Deck> {
    const entries = parseDecklist(input.decklist)
    const lookup = await this.scryfall.lookup(entries.map((entry) => entry.name))

    return db.transaction(async (trx) => {
      const deck = await Deck.create({ userId: input.owner.id, name: input.name }, { client: trx })

      await deck.related('cards').createMany(
        entries.map((entry) => {
          const key = entry.name.toLowerCase()
          const typeLine = lookup?.typeLines.get(key)
          return {
            name: entry.name,
            quantity: entry.quantity,
            owned: false,
            category: entry.commander
              ? 'commander'
              : typeLine
                ? categoryFromTypeLine(typeLine)
                : categoryFromName(entry.name),
            notFound: lookup?.notFound.has(key) ?? false,
            colorIdentity: lookup?.colors.get(key) ?? null,
            scryfallId: lookup?.ids.get(key) ?? null,
          }
        })
      )

      return deck
    })
  }
}
