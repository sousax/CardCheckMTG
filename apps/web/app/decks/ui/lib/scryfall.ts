// Hotlinked straight into <img>/background-image: Scryfall resolves the name
// (fuzzy) and redirects to the image, so no API call is needed client-side.
export function scryfallImage(name: string, version: 'normal' | 'art_crop' = 'normal') {
  return `https://api.scryfall.com/cards/named?format=image&version=${version}&fuzzy=${encodeURIComponent(name)}`
}

const CHARACTERS = [
  'Gideon, Ally of Zendikar',
  'Chandra, Torch of Defiance',
  'Jace, the Mind Sculptor',
  'Liliana of the Veil',
  'Nissa, Who Shakes the World',
]

export function characterArt(seed: number) {
  return scryfallImage(CHARACTERS[seed % CHARACTERS.length], 'art_crop')
}
