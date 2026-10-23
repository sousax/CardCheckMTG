import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'deck_cards'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Nullable: older imports (or Scryfall down) fall back to the fuzzy name URL.
      table.uuid('scryfall_id').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('scryfall_id')
    })
  }
}
