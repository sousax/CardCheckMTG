import { useState } from 'react'

import { Button } from '@workspace/ui/components/button'

import { useTranslation } from '#common/ui/hooks/use_translation'

import type { ShoppingItem } from '#decks/queries/get_shopping_list'
import { scryfallImage } from '#decks/ui/lib/scryfall'

// Enough to act on at a glance; the rest is one click away.
const PREVIEW_COUNT = 12

export function ShoppingList({ items }: { items: ShoppingItem[] }) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? items : items.slice(0, PREVIEW_COUNT)

  return (
    <section className="mt-14">
      <div className="mb-1.5 flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
        <h2 className="font-display text-[40px] leading-none">
          {t('decks.overview.shopping.title')}
        </h2>
        <span className="text-[13px] font-semibold text-muted-foreground">
          {t('decks.overview.shopping.count', { count: items.length })}
        </span>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">{t('decks.overview.shopping.note')}</p>

      <ul className="flex flex-col gap-2">
        {visible.map((item) => (
          <li
            key={item.name}
            className="flex items-center gap-2.5 rounded-lg border border-line bg-card py-2 pr-3.5 pl-2 text-base font-semibold sm:gap-3"
          >
            <div
              aria-hidden
              className="relative size-[34px] shrink-0 overflow-hidden rounded-sm bg-surface-2"
            >
              <img
                src={scryfallImage(item.name, 'art_crop', item.scryfallId)}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute top-[22%] left-1/2 w-[240%] max-w-none -translate-x-1/2 -translate-y-[22%]"
              />
            </div>
            <span className="w-8 shrink-0 font-bold text-red-text sm:w-11">×{item.quantity}</span>
            <span className="min-w-0 flex-1 truncate">{item.name}</span>
            <span className="hidden max-w-[40%] truncate text-xs font-medium tracking-[.06em] text-muted-foreground uppercase sm:block">
              {item.decks.join(' · ')}
            </span>
          </li>
        ))}
      </ul>

      {items.length > PREVIEW_COUNT && (
        <Button variant="outline" className="mt-4" onClick={() => setExpanded((e) => !e)}>
          {expanded
            ? t('decks.overview.shopping.showLess')
            : t('decks.overview.shopping.showAll', { count: items.length })}
        </Button>
      )}
    </section>
  )
}
