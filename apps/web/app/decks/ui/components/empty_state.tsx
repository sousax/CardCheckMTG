import type React from 'react'

import { scryfallImage } from '#decks/ui/lib/scryfall'

interface EmptyStateProps {
  title: string
  action: React.ReactNode
  children: React.ReactNode
}

export function EmptyState({ title, action, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-dashed border-edge bg-card p-6 text-[15px] leading-normal text-muted-foreground sm:flex-row sm:items-center sm:gap-9 sm:p-9">
      <div
        aria-hidden
        className="h-[170px] shrink-0 rounded-lg bg-cover bg-[center_25%] shadow-md sm:w-[170px]"
        style={{ backgroundImage: `url("${scryfallImage('Liliana of the Veil', 'art_crop')}")` }}
      />
      <div className="flex flex-col items-start gap-3">
        <h2 className="font-display text-4xl leading-none text-red-text">{title}</h2>
        <p>{children}</p>
        {action}
      </div>
    </div>
  )
}
