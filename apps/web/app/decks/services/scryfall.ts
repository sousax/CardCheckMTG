import logger from '@adonisjs/core/services/logger'

const COLLECTION_URL = 'https://api.scryfall.com/cards/collection'
// Scryfall's documented limit per /cards/collection request.
const BATCH_SIZE = 75

interface ScryfallCard {
  name: string
  type_line?: string
  color_identity?: string[]
  card_faces?: { name: string; type_line?: string }[]
}

interface CollectionResponse {
  data: ScryfallCard[]
  not_found: { name?: string }[]
}

export interface CardLookup {
  /** Lowercased requested name → front-face type line. */
  typeLines: Map<string, string>
  /** Lowercased requested name → color identity in WUBRG order ("" = colorless). */
  colors: Map<string, string>
  /** Lowercased names Scryfall did not recognize. */
  notFound: Set<string>
}

const WUBRG = 'WUBRG'

export function toWubrg(colors: Iterable<string>): string {
  const set = new Set(colors)
  return [...WUBRG].filter((c) => set.has(c)).join('')
}

export default class Scryfall {
  /**
   * Resolves card types in batches. Returns null when Scryfall can't be
   * reached so callers can fall back instead of failing the import.
   */
  async lookup(names: string[]): Promise<CardLookup | null> {
    const result: CardLookup = { typeLines: new Map(), colors: new Map(), notFound: new Set() }

    try {
      for (let i = 0; i < names.length; i += BATCH_SIZE) {
        const batch = names.slice(i, i + BATCH_SIZE)
        const response = await fetch(COLLECTION_URL, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'CardCheckMTG/1.0',
          },
          body: JSON.stringify({ identifiers: batch.map((name) => ({ name })) }),
          signal: AbortSignal.timeout(10_000),
        })
        if (!response.ok) throw new Error(`Scryfall responded ${response.status}`)

        const body = (await response.json()) as CollectionResponse
        for (const card of body.data) {
          const front = card.card_faces?.[0]
          const typeLine = card.type_line ?? front?.type_line ?? ''
          const colors = toWubrg(card.color_identity ?? [])
          for (const name of front ? [card.name, front.name] : [card.name]) {
            result.typeLines.set(name.toLowerCase(), typeLine)
            result.colors.set(name.toLowerCase(), colors)
          }
        }
        for (const missing of body.not_found) {
          if (missing.name) result.notFound.add(missing.name.toLowerCase())
        }
      }
    } catch (error) {
      logger.warn({ err: error }, 'scryfall lookup failed, falling back to local categories')
      return null
    }

    return result
  }
}
