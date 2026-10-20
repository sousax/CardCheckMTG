import type Deck from '#decks/models/deck'

export interface DeleteDeckInput {
  deck: Deck
}

export default class DeleteDeck {
  async handle(input: DeleteDeckInput): Promise<void> {
    await input.deck.delete()
  }
}
