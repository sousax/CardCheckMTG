import { column } from '@adonisjs/lucid/orm'

import BaseModel from '#common/models/base_model'

export default class ContactMessage extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare email: string

  @column()
  declare message: string
}
