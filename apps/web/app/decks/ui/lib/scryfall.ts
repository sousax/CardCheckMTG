// Hotlinked straight into <img>/background-image: Scryfall resolves the name
// (fuzzy) and redirects to the image, so no API call is needed client-side.
export function scryfallImage(name: string, version: 'normal' | 'art_crop' = 'normal') {
  return `https://api.scryfall.com/cards/named?format=image&version=${version}&fuzzy=${encodeURIComponent(name)}`
}
