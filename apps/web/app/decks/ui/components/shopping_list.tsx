import { useState } from 'react'
import { Copy, ExternalLink } from 'lucide-react'

import { Button } from '@workspace/ui/components/button'
import { toast } from '@workspace/ui/hooks/use-toast'

import { useTranslation } from '#common/ui/hooks/use_translation'

import type { ShoppingItem } from '#decks/queries/get_shopping_list'
import { scryfallImage } from '#decks/ui/lib/scryfall'

// Enough to act on at a glance; the rest is one click away.
const PREVIEW_COUNT = 12

const ligaMagicUrl = (name: string) =>
  `https://www.ligamagic.com.br/?view=cards/card&card=${encodeURIComponent(name)}`

export function ShoppingList({ items }: { items: ShoppingItem[] }) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  // Basic lands are cheap and usually already in a collection: one quiet row
  // at the end instead of the top of the list.
  const cards = items.filter((item) => !item.basicLand)
  const basics = items.filter((item) => item.basicLand)
  // Hiding a single card behind "show all" costs a click for nothing.
  const collapsible = cards.length > PREVIEW_COUNT + 1
  const visible = collapsible && !expanded ? cards.slice(0, PREVIEW_COUNT) : cards

  async function copyList() {
    const text = [...cards, ...basics].map((item) => `${item.quantity} ${item.name}`).join('\n')
    try {
      await navigator.clipboard.writeText(text)
      toast.success(t('decks.overview.shopping.copied'))
    } catch {
      toast.error(t('decks.overview.shopping.copyFailed'))
    }
  }

  return (
    <section id="compras" className="mt-14 scroll-mt-6">
      <div className="mb-1.5 flex flex-wrap items-baseline gap-x-3.5 gap-y-2">
        <h2 className="font-display text-[40px] leading-none">
          {t('decks.overview.shopping.title')}
        </h2>
        <span className="text-[13px] font-semibold text-muted-foreground">
          {t('decks.overview.shopping.count', { count: cards.length })}
        </span>
        <Button variant="outline" onClick={copyList} className="ml-auto self-center">
          <Copy />
          {t('decks.overview.shopping.copy')}
        </Button>
      </div>
      <p className="mb-4 text-sm text-pretty text-muted-foreground">
        {t('decks.overview.shopping.note')}
      </p>

      <ul className="flex flex-col gap-2">
        {visible.map((item) => (
          <li
            key={item.name}
            className="flex items-center gap-2.5 rounded-lg border border-line bg-card py-2 pr-2 pl-2 text-base font-semibold sm:gap-3"
          >
            <div
              aria-hidden
              className="relative size-[34px] shrink-0 overflow-hidden rounded-sm bg-surface-2"
            >
              {/* Shows through when Scryfall has no art for the card. */}
              <span className="absolute inset-0 flex items-center justify-center font-display text-lg text-muted-foreground">
                {item.name[0]}
              </span>
              <img
                src={scryfallImage(item.name, 'art_crop', item.scryfallId)}
                alt=""
                loading="lazy"
                decoding="async"
                onError={(e) => (e.currentTarget.hidden = true)}
                className="absolute top-[22%] left-1/2 w-[240%] max-w-none -translate-x-1/2 -translate-y-[22%]"
              />
            </div>
            <span className="w-8 shrink-0 font-bold text-red-text sm:w-11">×{item.quantity}</span>
            <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-center sm:gap-3">
              <span className="min-w-0 truncate sm:flex-1">{item.name}</span>
              <span className="truncate text-xs font-medium tracking-[.06em] text-muted-foreground uppercase sm:max-w-[40%]">
                {item.decks.join(' · ')}
              </span>
            </div>
            <a
              href={ligaMagicUrl(item.name)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('decks.overview.shopping.store', { name: item.name })}
              title={t('decks.overview.shopping.store', { name: item.name })}
              className="flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              <ExternalLink className="size-4" />
            </a>
          </li>
        ))}
        {basics.length > 0 && (
          <li className="flex items-center gap-2.5 rounded-lg border border-dashed border-line py-2 pr-3.5 pl-3 text-sm text-muted-foreground sm:gap-3">
            <span className="shrink-0 font-semibold">{t('decks.overview.shopping.basics')}</span>
            <span className="min-w-0 truncate">
              {basics.map((item) => `${item.quantity} ${item.name}`).join(' · ')}
            </span>
          </li>
        )}
      </ul>

      {collapsible && (
        <Button variant="outline" className="mt-4" onClick={() => setExpanded((e) => !e)}>
          {expanded
            ? t('decks.overview.shopping.showLess')
            : t('decks.overview.shopping.showAll', { count: cards.length })}
        </Button>
      )}
    </section>
  )
}
