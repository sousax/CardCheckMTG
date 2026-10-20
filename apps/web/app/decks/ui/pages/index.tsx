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
          <span className="text-xs font-bold tracking-[.14em] text-red-text uppercase">
            {t('decks.overview.eyebrow')}
          </span>
          <h1 className="mt-2.5 mb-5.5 font-display text-[clamp(48px,7vw,76px)] leading-[.9]">
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
                value: `${total ? Math.round((owned / total) * 100) : 0}%`,
                label: t('decks.overview.stats.complete'),
                accent: true,
              },
            ]}
          />

          <div className="mt-10 grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-6">
            {decks.map((deck) => (
              <DeckTile key={deck.id} deck={deck} />
            ))}
            <button
              type="button"
              onClick={openImport}
              className="flex min-h-[300px] flex-col items-center justify-center gap-2 border-[3px] border-dashed border-edge transition-colors duration-[120ms] hover:bg-card"
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
