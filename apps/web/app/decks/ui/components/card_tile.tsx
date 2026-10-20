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
    <div className="relative border-[3px] border-edge bg-card shadow-hard-md transition-[transform,box-shadow] duration-[120ms] hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-hard-hover">
      {failed ? (
        <div className="flex aspect-[5/7] items-center justify-center border-b-[3px] border-edge p-4 text-center text-xs text-muted-foreground">
          {t('decks.card.notFound')}
        </div>
      ) : (
        <img
          src={scryfallImage(card.name)}
          alt={card.name}
          loading="lazy"
          onError={() => setFailed(true)}
          className={cn(
            'block aspect-[5/7] w-full border-b-[3px] border-edge object-cover',
            card.owned && 'opacity-60'
          )}
        />
      )}
      <RowCheck
        checked={card.owned}
        label={t('decks.card.toggle', { name: card.name })}
        onToggle={onToggle}
        className="absolute top-2.5 left-2.5"
      />
      <div className="absolute top-2.5 right-2.5 border-2 border-edge bg-red px-2 py-0.5 text-sm font-bold text-cream">
        ×{card.quantity}
      </div>
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 text-sm font-bold">
        <span className="min-w-0 truncate">{card.name}</span>
        <StatusPill owned={card.owned} className="shrink-0 px-1.5 py-1 text-[10px]" />
      </div>
    </div>
  )
}
