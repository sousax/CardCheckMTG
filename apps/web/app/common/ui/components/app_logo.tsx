import { Link } from '@adonisjs/inertia/react'

import { AppMark } from '#common/ui/components/app_mark'

// Mark + typeset wordmark. On the red band the mark's edge is ink and
// "CardList" is amber; elsewhere they follow the page (ink/cream, red).
export function AppLogo() {
  return (
    <Link
      route="decks.index"
      prefetch
      aria-label="MTG CardList"
      className="flex items-center gap-3.5 font-display text-[40px] leading-none whitespace-nowrap"
    >
      <AppMark className="size-12 text-foreground in-[.band]:text-ember" />
      <span>
        MTG <span className="text-red in-[.band]:text-amber">CardList</span>
      </span>
    </Link>
  )
}
