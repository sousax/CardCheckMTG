import { belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import BaseModel from '#common/models/base_model'
import User from '#users/models/user'

import DeckCard from '#decks/models/deck_card'

export default class Deck extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare name: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => DeckCard)
  declare cards: HasMany<typeof DeckCard>
}
