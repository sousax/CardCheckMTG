import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'deck_cards'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('deck_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('decks')
        .onDelete('CASCADE')
      table.string('name').notNullable()
      table.integer('quantity').unsigned().notNullable()
      table.boolean('owned').notNullable().defaultTo(false)
      table.string('category', 32).notNullable()
      table.boolean('not_found').notNullable().defaultTo(false)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.unique(['deck_id', 'name'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
