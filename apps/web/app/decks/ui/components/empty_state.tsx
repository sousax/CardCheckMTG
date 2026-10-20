import type React from 'react'

import { scryfallImage } from '#decks/ui/lib/scryfall'

interface EmptyStateProps {
  title: string
  action: React.ReactNode
  children: React.ReactNode
}

export function EmptyState({ title, action, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col gap-6 border-[3px] border-dashed border-edge bg-card p-6 text-[15px] leading-normal text-muted-foreground sm:flex-row sm:items-center sm:gap-9 sm:p-9">
      <div
        aria-hidden
        className="h-[180px] shrink-0 border-[3px] border-edge bg-cover bg-[center_25%] shadow-hard-lg sm:w-[180px]"
        style={{ backgroundImage: `url("${scryfallImage('Liliana of the Veil', 'art_crop')}")` }}
      />
      <div className="flex flex-col items-start gap-3">
        <h2 className="font-display text-4xl leading-none text-red">{title}</h2>
        <p>{children}</p>
        {action}
      </div>
    </div>
  )
}
