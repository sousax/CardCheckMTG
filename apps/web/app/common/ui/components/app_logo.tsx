import { Link } from '@adonisjs/inertia/react'

// Typeset mark — the brand has no logo file. "CardList" is amber on the red
// band and red everywhere else, where amber would lack contrast.
export function AppLogo() {
  return (
    <Link
      route="decks.index"
      prefetch
      className="font-display text-[40px] leading-none whitespace-nowrap"
    >
      MTG <span className="text-red in-[.band]:text-amber">CardList</span>
    </Link>
  )
}
