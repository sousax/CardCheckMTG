import { cn } from '@workspace/ui/lib/utils'

import { useTranslation } from '#common/ui/hooks/use_translation'

import { CATEGORIES, type Category } from '#decks/enums/category'
import { RowCheck } from '#decks/ui/components/row_check'
import { StatusPill } from '#decks/ui/components/status_pill'
import { scryfallImage } from '#decks/ui/lib/scryfall'
import type { DeckCardData } from '#decks/ui/lib/types'

interface CardRowProps {
  card: DeckCardData
  onToggle: () => void
  onCategoryChange: (category: Category) => void
  onPreview: () => void
}

export function CardRow({ card, onToggle, onCategoryChange, onPreview }: CardRowProps) {
  const { t } = useTranslation()

  return (
    <div
      onMouseEnter={onPreview}
      onFocus={onPreview}
      className="flex items-center gap-2.5 rounded-lg border border-line bg-card py-2 pr-3.5 pl-2 text-base font-semibold transition-colors duration-150 hover:border-edge hover:bg-surface-hover sm:gap-3"
    >
      <RowCheck
        checked={card.owned}
        label={t('decks.card.toggle', { name: card.name })}
        onToggle={onToggle}
      />
      <div
        aria-hidden
        className="relative hidden size-[34px] shrink-0 overflow-hidden rounded-sm bg-surface-2 sm:block"
      >
        {/* Shows through when Scryfall has no art for the card. */}
        <span className="absolute inset-0 flex items-center justify-center font-display text-lg text-muted-foreground">
          {card.name[0]}
        </span>
        <img
          src={scryfallImage(card.name, 'art_crop', card.scryfallId)}
          alt=""
          loading="lazy"
          decoding="async"
          onError={(e) => (e.currentTarget.hidden = true)}
          className="absolute top-[22%] left-1/2 w-[240%] max-w-none -translate-x-1/2 -translate-y-[22%]"
        />
      </div>
      <div className="w-8 shrink-0 font-bold text-red-text sm:w-11">×{card.quantity}</div>
      <div
        className={cn(
          'min-w-0 flex-1 truncate',
          card.notFound ? 'text-red-text' : card.owned && 'text-muted-foreground'
        )}
        title={card.notFound ? t('decks.card.notFound') : undefined}
      >
        {card.name}
      </div>
      <select
        value={card.category}
        onChange={(e) => onCategoryChange(e.target.value as Category)}
        title={t('decks.card.fixCategory')}
        aria-label={t('decks.card.fixCategory')}
        className="hidden w-36 shrink-0 cursor-pointer appearance-none rounded-sm border border-transparent bg-transparent px-1.5 py-1 text-xs font-medium tracking-[.06em] text-muted-foreground uppercase outline-none hover:border-edge focus-visible:border-edge md:block"
      >
        {CATEGORIES.map((category) => (
          <option key={category} value={category} className="bg-card text-foreground">
            {t(`decks.categories.${category}`)}
          </option>
        ))}
      </select>
      <StatusPill owned={card.owned} className="shrink-0 px-2 py-1 sm:w-[92px]" />
    </div>
  )
}
