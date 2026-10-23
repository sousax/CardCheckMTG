import { Link } from '@inertiajs/react'

import { cn } from '@workspace/ui/lib/utils'

import { useTranslation } from '#common/ui/hooks/use_translation'
import { urlFor } from '~/app/client'

import { CompletionRing } from '#decks/ui/components/completion_ring'
import { scryfallImage } from '#decks/ui/lib/scryfall'
import type { DeckOverview } from '#decks/ui/lib/types'

const MANA_BG: Record<string, string> = {
  W: 'bg-mana-w',
  U: 'bg-mana-u',
  B: 'bg-mana-b',
  R: 'bg-mana-r',
  G: 'bg-mana-g',
  C: 'bg-mana-w',
}

function manaSymbol(letter: string) {
  return `https://svgs.scryfall.io/card-symbols/${letter}.svg`
}

export function DeckTile({ deck }: { deck: DeckOverview }) {
  const { t } = useTranslation()
  const percentMissing = deck.total ? Math.round((1 - deck.owned / deck.total) * 100) : 0
  const complete = deck.pending === 0
  // "" is a colourless deck; null means we never learned its colours.
  const colors = deck.colors === null ? null : [...(deck.colors || 'C')]

  return (
    <Link
      href={urlFor('decks.show', { id: deck.id })}
      viewTransition
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-card shadow-md transition-[transform,box-shadow] duration-150 ease-out hover:-translate-y-[3px] hover:shadow-lg motion-reduce:transition-none"
    >
      <div className="relative aspect-[16/10] border-b border-line bg-background">
        {deck.featured && (
          <img
            src={scryfallImage(deck.featured, 'art_crop', deck.featuredScryfallId)}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover object-[center_25%]"
          />
        )}
        <span
          className={cn(
            'absolute right-2.5 bottom-2.5 rounded-xl border border-line px-2 py-1 text-xs font-bold',
            complete ? 'bg-amber text-on-amber' : 'bg-red text-on-red'
          )}
        >
          {complete
            ? t('decks.overview.tile.complete')
            : t('decks.overview.tile.missing', { percent: percentMissing })}
        </span>
      </div>

      {colors && (
        <div
          className="flex border-b border-line"
          role="img"
          aria-label={t('decks.overview.tile.colors', { colors: colors.join(' ') })}
        >
          {colors.map((letter, i) => (
            <div
              key={letter}
              className={cn(
                'flex h-6 flex-1 items-center justify-center',
                MANA_BG[letter],
                i > 0 && 'border-l border-line'
              )}
            >
              <img src={manaSymbol(letter)} alt="" className="size-[15px]" />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-1 items-center gap-3 px-3.5 pt-3.5 pb-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {/* Shared names: the title and ring travel into the deck page. */}
          <span
            className="w-fit max-w-full truncate font-display text-2xl leading-none"
            style={{ viewTransitionName: `deck-title-${deck.id}` }}
          >
            {deck.name}
          </span>
          <span className="text-xs font-bold">
            {t('decks.overview.tile.cards', { count: deck.total })}
          </span>
          {deck.featured && (
            <span className="truncate text-xs text-muted-foreground">{deck.featured}</span>
          )}
        </div>
        <div style={{ viewTransitionName: `deck-ring-${deck.id}` }}>
          <CompletionRing owned={deck.owned} total={deck.total} size={64} stroke={7} />
        </div>
      </div>

      <div className="flex justify-between gap-2 border-t border-line bg-background px-3.5 py-2 text-xs font-bold">
        <span className="truncate text-muted-foreground">
          {t('decks.hero.eyebrow', { count: deck.uniqueCards })}
        </span>
        <span className="shrink-0">
          {complete ? (
            <span className="text-amber-text">
              {t('decks.overview.tile.allSet')}
            </span>
          ) : (
            <span className="text-red-text">
              {t('decks.overview.tile.pending', { count: deck.pending })}
            </span>
          )}
        </span>
      </div>
    </Link>
  )
}
