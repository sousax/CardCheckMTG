import type Deck from '#decks/models/deck'

// A type alias, not an interface: Inertia props must be JSON-shaped, and
// interfaces don't satisfy its index-signature constraint.
export type ShoppingItem = {
  name: string
  scryfallId: string | null
  quantity: number
  decks: string[]
}

/**
 * Every card still missing across the user's decks, merged by name. Cards
 * several decks need come first: one purchase covers more of the collection.
 */
export default class GetShoppingList {
  handle(decks: Deck[]): ShoppingItem[] {
    const needed = new Map<string, ShoppingItem>()

    for (const deck of decks) {
      for (const card of deck.cards) {
        if (card.owned) continue
        const key = card.name.toLowerCase()
        const item = needed.get(key) ?? {
          name: card.name,
          scryfallId: card.scryfallId,
          quantity: 0,
          decks: [],
        }
        item.quantity += card.quantity
        item.decks.push(deck.name)
        needed.set(key, item)
      }
    }

    return [...needed.values()].sort(
      (a, b) => b.decks.length - a.decks.length || a.name.localeCompare(b.name)
    )
  }
}
