import type { Data } from '@generated/data'

export type DeckTab = Data.Decks.Deck.Variants['forTabs']
export type DeckDetail = Data.Decks.Deck.Variants['forShow']
export type DeckCardData = DeckDetail['cards'][number]
export type DeckOverview = Data.Decks.Deck.Variants['forOverview']
