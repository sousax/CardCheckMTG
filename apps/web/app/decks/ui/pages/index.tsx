import { useState } from 'react'
import { Head } from '@inertiajs/react'

import { Button } from '@workspace/ui/components/button'

import type { InertiaProps } from '#core/ui/types'
import AuthenticatedLayout from '#common/ui/components/authenticated_layout'
import { useTranslation } from '#common/ui/hooks/use_translation'

import type { ShoppingItem } from '#decks/queries/get_shopping_list'
import { DeckTabs } from '#decks/ui/components/deck_tabs'
import { DeckTile } from '#decks/ui/components/deck_tile'
import { EmptyState } from '#decks/ui/components/empty_state'
import { ImportDialog } from '#decks/ui/components/import_dialog'
import { ShoppingList } from '#decks/ui/components/shopping_list'
import { StatStrip } from '#decks/ui/components/stat_strip'
import type { DeckOverview } from '#decks/ui/lib/types'

type PageProps = InertiaProps<{
  decks: DeckOverview[]
  shoppingList: ShoppingItem[]
}>

export default function DecksIndexPage({ decks, shoppingList }: PageProps) {
  const { t } = useTranslation()
  const [importing, setImporting] = useState(false)
  const openImport = () => setImporting(true)

  const total = decks.reduce((sum, deck) => sum + deck.total, 0)
  const owned = decks.reduce((sum, deck) => sum + deck.owned, 0)
  const toBuy = shoppingList.filter((item) => !item.basicLand).length

  return (
    <AuthenticatedLayout bandNav={<DeckTabs decks={decks} onImport={openImport} />}>
      <Head title={t('decks.overview.title')} />

      {decks.length === 0 ? (
        <div className="pt-7 pb-20">
          <EmptyState
            title={t('decks.empty.title')}
            action={<Button onClick={openImport}>{t('decks.empty.action')}</Button>}
          >
            {t('decks.empty.body')}
          </EmptyState>
        </div>
      ) : (
        <div className="pt-8 pb-20">
          <h1 className="mb-5.5 font-display text-[clamp(48px,7vw,76px)] leading-[.9]">
            {t('decks.overview.title')}
          </h1>
          <StatStrip
            items={[
              {
                value: decks.length,
                label: t('decks.overview.stats.decks', { count: decks.length }),
              },
              { value: owned, label: t('decks.overview.stats.owned') },
              { value: total - owned, label: t('decks.overview.stats.pending') },
              {
                // floor, like the rings: 99.6% must not read as done.
                value: `${total ? Math.floor((owned / total) * 100) : 0}%`,
                label: t('decks.overview.stats.complete'),
                accent: true,
              },
            ]}
          />
          {toBuy > 0 && (
            <a
              href="#compras"
              className="mt-4 inline-flex h-10 items-center rounded-md border border-edge px-3.5 text-[13px] font-semibold sm:hidden"
            >
              {t('decks.overview.shopping.jump', { count: toBuy })}
            </a>
          )}

          <div className="mt-10 grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-6">
            {decks.map((deck) => (
              <DeckTile key={deck.id} deck={deck} />
            ))}
            <button
              type="button"
              onClick={openImport}
              className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-edge transition-colors duration-150 hover:bg-surface-hover sm:min-h-[300px]"
            >
              <span className="font-display text-[28px] text-red-text">
                {t('decks.overview.newDeck.title')}
              </span>
              <span className="text-[13px] text-muted-foreground">
                {t('decks.overview.newDeck.hint')}
              </span>
            </button>
          </div>

          {shoppingList.length > 0 && <ShoppingList items={shoppingList} />}
        </div>
      )}

      <ImportDialog open={importing} onOpenChange={setImporting} />
    </AuthenticatedLayout>
  )
}
