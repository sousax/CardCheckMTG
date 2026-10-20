import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'deck_cards'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Nullable: decks imported before this column (or while Scryfall was
      // down) have no colour data, which is different from colourless ("").
      table.string('color_identity', 5).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('color_identity')
    })
  }
}
