import type { Category } from '#decks/enums/category'

const BASIC_LANDS = new Set(['plains', 'island', 'swamp', 'mountain', 'forest', 'wastes'])

export function isBasicLand(name: string): boolean {
  return BASIC_LANDS.has(name.toLowerCase().trim())
}

// Fallback for when Scryfall is unreachable. Users can still fix any card's
// category from the checklist.
const KNOWN: Record<string, Category> = {
  'kaito, dancing shadow': 'planeswalkers',
  'wingcrafter': 'creatures',
  'command tower': 'lands',
  'path of ancestry': 'lands',
  'waterfront district': 'lands',
  'ornithopter': 'creatures',
  "rogue's passage": 'lands',
  'jwar isle refuge': 'lands',
  'dismal backwater': 'lands',
  'access tunnel': 'lands',
  "wayfarer's bauble": 'artifacts',
  'siren stormtamer': 'creatures',
  'aqueous form': 'enchantments',
  'gingerbrute': 'creatures',
  'slither blade': 'creatures',
  'spectral sailor': 'creatures',
  'mothdust changeling': 'creatures',
  'changeling outcast': 'creatures',
  'signal pest': 'creatures',
  'faerie dreamthief': 'creatures',
  'thousand-faced shadow': 'creatures',
  'faerie seer': 'creatures',
  'lazotep plating': 'instants',
  'sage owl': 'creatures',
  'spire owl': 'creatures',
  'augury owl': 'creatures',
  'saiba cryptomancer': 'creatures',
  'sky diamond': 'artifacts',
  'charcoal diamond': 'artifacts',
  'jwari disruption': 'sorceries',
  'telling time': 'sorceries',
  'cunning evasion': 'instants',
  'moon-circuit hacker': 'creatures',
  'skullsnatcher': 'creatures',
  'prismatic lens': 'artifacts',
  'smoke shroud': 'instants',
  'silver-fur master': 'creatures',
  'amoeboid changeling': 'creatures',
  'ebony fly': 'creatures',
  'ornithopter of paradise': 'creatures',
  'nightveil sprite': 'creatures',
  'dokuchi silencer': 'creatures',
  'tetsuko umezawa, fugitive': 'creatures',
  'arcane adaptation': 'enchantments',
  'grazilaxx, illithid scholar': 'creatures',
  'prosperous thief': 'creatures',
  'biting-palm ninja': 'creatures',
  'satoru umezawa': 'creatures',
  'mistblade shinobi': 'creatures',
  "yuriko, the tiger's shadow": 'creatures',
  'moonsnare specialist': 'creatures',
  'aetherize': 'instants',
  'ingenious infiltrator': 'creatures',
  'consuming tide': 'sorceries',
  'reconnaissance mission': 'instants',
  'azra smokeshaper': 'creatures',
  'ninja of the deep hours': 'creatures',
  'far': 'instants',
  'okiba-gang shinobi': 'creatures',
  'xenograft': 'enchantments',
  "curtains' call": 'instants',
  'discovery': 'sorceries',
  'sapphire dragon': 'creatures',
  'consign': 'sorceries',
  'never': 'sorceries',
  'treasure cruise': 'sorceries',
  'spite': 'instants',
  'dig through time': 'instants',
  'connive': 'sorceries',
  'commit': 'instants',
  'rags': 'sorceries',
  'shadow of mortality': 'sorceries',
}

export function categoryFromName(name: string): Category {
  const key = name.toLowerCase().trim()
  if (BASIC_LANDS.has(key)) return 'lands'
  return KNOWN[key] ?? 'other'
}

// Precedence matters: "Artifact Creature" is a creature, "Artifact Land" a land.
const TYPE_PRECEDENCE: [string, Category][] = [
  ['creature', 'creatures'],
  ['planeswalker', 'planeswalkers'],
  ['land', 'lands'],
  ['instant', 'instants'],
  ['sorcery', 'sorceries'],
  ['artifact', 'artifacts'],
  ['enchantment', 'enchantments'],
]

/** "Legendary Creature — Ninja // Land" → creatures (front face wins). */
export function categoryFromTypeLine(typeLine: string): Category {
  const types = typeLine.split('//')[0].split('—')[0].toLowerCase()
  const words = new Set(types.split(/\s+/))
  for (const [type, category] of TYPE_PRECEDENCE) {
    if (words.has(type)) return category
  }
  return 'other'
}
