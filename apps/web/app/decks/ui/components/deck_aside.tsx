import { cn } from '@workspace/ui/lib/utils'

import { useTranslation } from '#common/ui/hooks/use_translation'

import { CompletionRing } from '#decks/ui/components/completion_ring'
import { StatusPill } from '#decks/ui/components/status_pill'
import { scryfallImage } from '#decks/ui/lib/scryfall'
import type { DeckCardData } from '#decks/ui/lib/types'

interface DeckAsideProps {
  deckId: number
  featured: DeckCardData | undefined
  preview: DeckCardData | null
  owned: number
  total: number
  pending: number
}

// Sticky left column: the deck's featured card, swapped for whatever card is
// hovered so the art is always one glance away, plus overall progress.
export function DeckAside({ deckId, featured, preview, owned, total, pending }: DeckAsideProps) {
  const { t } = useTranslation()
  const shown = preview ?? featured
  const percent = total === 0 ? 0 : Math.round((owned / total) * 100)

  return (
    <aside className="flex flex-col gap-5 max-[1000px]:grid max-[1000px]:grid-cols-[minmax(0,220px)_minmax(0,1fr)] max-[1000px]:items-start max-[640px]:grid-cols-[minmax(0,150px)_minmax(0,1fr)] max-[640px]:gap-4 min-[1000px]:sticky min-[1000px]:top-5">
      <div>
        <span
          className={cn(
            'mb-2.5 inline-block border-2 px-2 py-1 text-xs font-bold tracking-[.14em] uppercase',
            preview ? 'border-edge bg-card' : 'border-amber bg-amber text-ember'
          )}
        >
          {preview ? t('decks.aside.preview') : t('decks.aside.featured')}
        </span>
        <div className="aspect-[5/7] border-[3px] border-edge bg-card shadow-hard-lg">
          {shown && (
            <img
              key={shown.name}
              src={scryfallImage(shown.name)}
              alt={shown.name}
              className="block size-full animate-preview-in object-cover"
            />
          )}
        </div>
        {shown && (
          <div className="mt-3 flex items-center justify-between gap-2 text-sm font-bold">
            <span className="min-w-0 truncate">{shown.name}</span>
            <StatusPill
              owned={shown.owned}
              missingLabel
              className="shrink-0 px-1.5 py-0.5 text-[10px]"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4.5 border-[3px] border-edge bg-card p-4 shadow-hard-md max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-3 max-[640px]:p-3">
        <div style={{ viewTransitionName: `deck-ring-${deckId}` }}>
          <CompletionRing owned={owned} total={total} />
        </div>
        <div className="flex flex-col gap-1.5 text-[13px] font-bold">
          <span>{t('decks.progress.owned', { owned, total })}</span>
          <span className="font-medium text-muted-foreground">
            {t('decks.progress.pending', { count: pending })}
          </span>
          <span className="font-medium text-muted-foreground">
            {t('decks.progress.complete', { percent })}
          </span>
        </div>
      </div>
    </aside>
  )
}
