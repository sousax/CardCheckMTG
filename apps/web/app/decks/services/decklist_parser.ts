export interface DecklistEntry {
  name: string
  quantity: number
  /** Listed under a "Commander" header (Arena/Moxfield exports). */
  commander?: true
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
  let inCommander = false

  for (const raw of text.split('\n')) {
    const line = raw.trim()
    const header = line.match(SECTION_HEADER)
    if (header) {
      inCommander = header[1].toLowerCase() === 'commander'
      continue
    }
    // A blank line ends the commander block, so a deck pasted below it without
    // a "Deck" header isn't swallowed into it.
    if (!line) inCommander = false
    if (!line || line.startsWith('//') || line.startsWith('#')) continue

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
    else merged.set(key, inCommander ? { name, quantity, commander: true } : { name, quantity })
  }

  return [...merged.values()]
}
