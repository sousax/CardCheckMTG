import { BaseTransformer } from '@adonisjs/core/transformers'

import type Deck from '#decks/models/deck'

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
