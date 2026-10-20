import { BaseTransformer } from '@adonisjs/core/transformers'

import type Deck from '#decks/models/deck'
import type DeckCard from '#decks/models/deck_card'
import { toWubrg } from '#decks/services/scryfall'

export default class DeckTransformer extends BaseTransformer<Deck> {
  toObject() {
    return {
      id: this.resource.id,
      name: this.resource.name,
    }
  }

  forTabs() {
    return this.toObject()
  }

  forOverview() {
    const cards = this.resource.cards
    const sum = (list: DeckCard[]) => list.reduce((total, card) => total + card.quantity, 0)
    const known = cards.filter((card) => card.colorIdentity !== null)

    return {
      ...this.toObject(),
      // First decklist entry is the deck's face (the commander, in Commander).
      featured: cards[0]?.name ?? null,
      uniqueCards: cards.length,
      total: sum(cards),
      owned: sum(cards.filter((card) => card.owned)),
      pending: cards.filter((card) => !card.owned).length,
      // null = unknown (imported without Scryfall data); "" = colourless.
      colors: known.length ? toWubrg(known.flatMap((card) => [...card.colorIdentity!])) : null,
    }
  }

  forShow() {
    return {
      ...this.toObject(),
      cards: this.resource.cards.map((card) => ({
        id: card.id,
        name: card.name,
        quantity: card.quantity,
        owned: card.owned,
        category: card.category,
        notFound: card.notFound,
      })),
    }
  }
}
