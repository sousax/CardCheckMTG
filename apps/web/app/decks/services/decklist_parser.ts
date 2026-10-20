export interface DecklistEntry {
  name: string
  quantity: number
}

const SECTION_HEADER = /^(deck|sideboard|maybeboard|commander)s?:?$/i
const LINE = /^(\d+)\s*x?\s+(.+)$/i
// "(STA) 42", "(stx)", "(2XM) 123★"
const SET_SUFFIX = /\s*\([A-Za-z0-9]{2,6}\)\s*[\w\-★]*\s*$/
const FOIL_SUFFIX = /\s*\*F\*\s*$/i

/**
 * Reads "4 Lightning Bolt" / "4x Lightning Bolt (2XM) 123" lines, ignores
 * anything else, and merges duplicates case-insensitively.
 */
export function parseDecklist(text: string): DecklistEntry[] {
  const merged = new Map<string, DecklistEntry>()

  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (!line || SECTION_HEADER.test(line) || line.startsWith('//') || line.startsWith('#')) {
      continue
    }

    const match = line.match(LINE)
    if (!match) continue

    const quantity = Number.parseInt(match[1], 10)
    let name = match[2].replace(FOIL_SUFFIX, '').replace(SET_SUFFIX, '').trim()
    // Double-faced cards: the front face is what Scryfall resolves.
    if (name.includes('//')) name = name.split('//')[0].trim()
    if (!name || quantity < 1) continue

    const key = name.toLowerCase()
    const existing = merged.get(key)
    if (existing) existing.quantity += quantity
    else merged.set(key, { name, quantity })
  }

  return [...merged.values()]
}
