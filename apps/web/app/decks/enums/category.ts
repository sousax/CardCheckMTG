// Display order of the checklist sections.
export const CATEGORIES = [
  'creatures',
  'planeswalkers',
  'artifacts',
  'enchantments',
  'instants',
  'sorceries',
  'lands',
  'other',
] as const

export type Category = (typeof CATEGORIES)[number]
