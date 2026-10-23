// Display order of the checklist sections.
export const CATEGORIES = [
  // Not a card type: marks the deck's commander and makes it the deck's face.
  'commander',
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
