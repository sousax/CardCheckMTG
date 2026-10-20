import type { Category } from '#decks/enums/category'
import type DeckCard from '#decks/models/deck_card'

export interface UpdateDeckCardInput {
  card: DeckCard
  owned?: boolean
  category?: Category
}

export default class UpdateDeckCard {
  async handle(input: UpdateDeckCardInput): Promise<DeckCard> {
    if (input.owned !== undefined) input.card.owned = input.owned
    if (input.category !== undefined) input.card.category = input.category
    return input.card.save()
  }
}
