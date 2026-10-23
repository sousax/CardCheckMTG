import { Link } from '@adonisjs/inertia/react'

import { AppMark } from '#common/ui/components/app_mark'

// Mark + typeset wordmark. "CardList" takes the palette accent, except on the
// accent band (landing, auth), where it would vanish into the background.
export function AppLogo() {
  return (
    <Link
      route="decks.index"
      prefetch
      aria-label="MTG CardList"
      className="flex items-center gap-3 font-display text-[34px] leading-none whitespace-nowrap"
    >
      <AppMark className="size-10" />
      <span>
        MTG <span className="text-red in-[.band]:text-on-red">CardList</span>
      </span>
    </Link>
  )
}
