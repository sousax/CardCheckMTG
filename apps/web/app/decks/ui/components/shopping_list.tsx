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
        <span className="text-[13px] font-bold text-muted-foreground">
          {t('decks.overview.shopping.count', { count: items.length })}
        </span>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">{t('decks.overview.shopping.note')}</p>

      <ul className="flex flex-col gap-2">
        {visible.map((item) => (
          <li
            key={item.name}
            className="flex items-center gap-2.5 border-2 border-edge bg-card py-2 pr-3.5 pl-2 text-base font-bold sm:gap-4"
          >
            <div
              aria-hidden
              className="size-9 shrink-0 border-2 border-edge bg-background bg-[length:240%] bg-[center_22%] bg-no-repeat"
              style={{ backgroundImage: `url("${scryfallImage(item.name, 'art_crop')}")` }}
            />
            <span className="w-8 shrink-0 text-lg text-red-text sm:w-11">×{item.quantity}</span>
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
