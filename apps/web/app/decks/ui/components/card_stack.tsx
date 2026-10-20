import { useState } from 'react'

import { cn } from '@workspace/ui/lib/utils'

import { useTranslation } from '#common/ui/hooks/use_translation'

import { scryfallImage } from '#decks/ui/lib/scryfall'
import type { DeckCardData } from '#decks/ui/lib/types'
import { useStamp } from '#decks/ui/lib/use_stamp'

interface CardStackProps {
  title: string
  cards: DeckCardData[]
  onToggle: (card: DeckCardData) => void
  onPreview: (card: DeckCardData | null) => void
}

function StackStatus({ owned }: { owned: boolean }) {
  const { t } = useTranslation()
  const ref = useStamp<HTMLSpanElement>(owned)
  return (
    <span
      ref={ref}
      className={cn(
        'border-2 border-edge px-1.5 py-[3px] text-[10px] font-bold tracking-[.1em] uppercase',
        owned ? 'bg-amber text-ember' : 'bg-card text-muted-foreground'
      )}
    >
      {owned ? t('decks.status.owned') : t('decks.status.missing')}
    </span>
  )
}

// Visible sliver of each card under the next one, like a pile on the table.
const PEEK = 34

export function CardStack({ title, cards, onToggle, onPreview }: CardStackProps) {
  const { t } = useTranslation()
  const [active, setActive] = useState(-1)
  const owned = cards.filter((c) => c.owned).reduce((sum, c) => sum + c.quantity, 0)
  const total = cards.reduce((sum, c) => sum + c.quantity, 0)

  const focus = (i: number) => {
    setActive(i)
    onPreview(i < 0 ? null : cards[i])
  }

  return (
    <section className="min-w-0">
      <div className="mb-2.5 flex items-baseline justify-between gap-2 border-b-2 border-edge pb-2">
        <h2 className="font-display text-2xl leading-none">{title}</h2>
        <span className="text-xs font-bold text-muted-foreground">
          {owned} / {total}
        </span>
      </div>
      <div className="relative" onMouseLeave={() => focus(-1)}>
        {cards.map((card, i) => {
          const raised = active === i
          const last = i === cards.length - 1
          return (
            <button
              key={card.id}
              type="button"
              aria-pressed={card.owned}
              aria-label={t('decks.card.toggle', { name: card.name })}
              onClick={() => onToggle(card)}
              onMouseEnter={() => focus(i)}
              onFocus={() => focus(i)}
              onBlur={() => focus(-1)}
              className={cn(
                'relative block w-full cursor-pointer text-left transition-transform duration-[120ms] ease-out motion-reduce:transition-none',
                raised && !last && '-translate-y-1.5'
              )}
              style={{
                // A 5:7 card is 140% of its width tall; pull each one up so
                // only PEEK px of the previous card shows.
                marginTop: i ? `calc(-140% + ${PEEK}px)` : 0,
                zIndex: raised ? 50 : i,
              }}
            >
              <div
                className={cn(
                  'relative aspect-[5/7] border-2 border-edge bg-card bg-cover bg-center',
                  raised && 'shadow-hard-row'
                )}
                style={{ backgroundImage: `url("${scryfallImage(card.name)}")` }}
              >
                <div
                  className={cn(
                    'absolute inset-0 bg-ember/35 transition-opacity duration-[120ms]',
                    card.owned ? 'opacity-100' : 'opacity-0'
                  )}
                />
                <div className="absolute top-1.5 right-1.5 flex gap-1">
                  {card.quantity > 1 && (
                    <span className="border-2 border-edge bg-red-strong px-1.5 py-0.5 text-[11px] font-bold text-cream">
                      ×{card.quantity}
                    </span>
                  )}
                  <StackStatus owned={card.owned} />
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
