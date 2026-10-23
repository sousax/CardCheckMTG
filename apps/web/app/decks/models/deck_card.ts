import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import BaseModel from '#common/models/base_model'

import type { Category } from '#decks/enums/category'
import Deck from '#decks/models/deck'

export default class DeckCard extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare deckId: number

  @column()
  declare name: string

  @column()
  declare quantity: number

  @column()
  declare owned: boolean

  @column()
  declare category: Category

  @column()
  declare notFound: boolean

  /** WUBRG letters, "" for colorless, null when Scryfall wasn't reachable. */
  @column()
  declare colorIdentity: string | null

  /** Null when Scryfall wasn't reachable; the UI falls back to the name lookup. */
  @column()
  declare scryfallId: string | null

  @belongsTo(() => Deck)
  declare deck: BelongsTo<typeof Deck>
}
