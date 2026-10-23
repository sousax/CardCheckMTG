// With an id, the image comes straight from Scryfall's CDN (no rate limit,
// long cache). Without one (older imports), fall back to the API's fuzzy
// name lookup, which is rate-limited and costs a redirect per image.
export function scryfallImage(
  name: string,
  version: 'normal' | 'art_crop' = 'normal',
  id?: string | null
) {
  if (id) return `https://cards.scryfall.io/${version}/front/${id[0]}/${id[1]}/${id}.jpg`
  return `https://api.scryfall.com/cards/named?format=image&version=${version}&fuzzy=${encodeURIComponent(name)}`
}
