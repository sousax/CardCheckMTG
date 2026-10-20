import vine from '@vinejs/vine'

import { parseDecklist } from '#decks/services/decklist_parser'

const recognizableDecklist = vine.createRule((value, _, field) => {
  if (typeof value === 'string' && parseDecklist(value).length === 0) {
    field.report('', 'decklist', field)
  }
})

export const createDeckValidator = vine.create({
  decklist: vine.string().trim().maxLength(20_000).use(recognizableDecklist()),
  name: vine.string().trim().maxLength(100).optional(),
})
