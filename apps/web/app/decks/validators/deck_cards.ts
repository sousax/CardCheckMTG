import vine from '@vinejs/vine'

import { CATEGORIES } from '#decks/enums/category'

export const updateDeckCardValidator = vine.create({
  owned: vine.boolean().optional(),
  category: vine.enum(CATEGORIES).optional(),
})
