import { useState } from 'react'

import { cn } from '@workspace/ui/lib/utils'

import { useTranslation } from '#common/ui/hooks/use_translation'

import { RowCheck } from '#decks/ui/components/row_check'
import { StatusPill } from '#decks/ui/components/status_pill'
import { scryfallImage } from '#decks/ui/lib/scryfall'
import type { DeckCardData } from '#decks/ui/lib/types'

export function CardTile({ card, onToggle }: { card: DeckCardData; onToggle: () => void }) {
  const { t } = useTranslation()
  const [failed, setFailed] = useState(false)

  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-card shadow-sm transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-[3px] hover:border-edge hover:shadow-lg">
      <div className="p-2 pb-0">
      {failed ? (
        <div className="flex aspect-[5/7] items-center justify-center rounded-[10px] bg-surface-2 p-4 text-center text-xs text-muted-foreground">
          {t('decks.card.notFound')}
        </div>
      ) : (
        <img
          src={scryfallImage(card.name, 'normal', card.scryfallId)}
          alt={card.name}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={cn(
            'block aspect-[5/7] w-full rounded-[10px] object-cover transition-opacity duration-150',
            card.owned && 'opacity-55'
          )}
        />
      )}
      </div>
      <RowCheck
        checked={card.owned}
        label={t('decks.card.toggle', { name: card.name })}
        onToggle={onToggle}
        className="absolute top-4 left-4 shadow-sm"
      />
      <div className="absolute top-4 right-4 rounded-sm bg-red px-2 py-0.5 text-[13px] font-bold text-on-red shadow-sm">
        ×{card.quantity}
      </div>
      <div className="flex items-center justify-between gap-2 px-3 pt-2.5 pb-3 text-sm font-semibold">
        <span className="min-w-0 truncate">{card.name}</span>
        <StatusPill owned={card.owned} className="shrink-0 rounded-xs px-2 py-1 text-[10px]" />
      </div>
    </div>
  )
}
