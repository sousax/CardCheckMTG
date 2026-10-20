import { useEffect, useMemo, useState } from 'react'
import { Head, router } from '@inertiajs/react'

import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'

import type { InertiaProps } from '#core/ui/types'
import AuthenticatedLayout from '#common/ui/components/authenticated_layout'
import { useTranslation } from '#common/ui/hooks/use_translation'
import { urlFor } from '~/app/client'

import { CATEGORIES, type Category } from '#decks/enums/category'
import { CardPreview, useCardPreview } from '#decks/ui/components/card_preview'
import { CardRow } from '#decks/ui/components/card_row'
import { CardTile } from '#decks/ui/components/card_tile'
import { CategoryHeader } from '#decks/ui/components/category_header'
import { DeckHero } from '#decks/ui/components/deck_hero'
import { DeckTabs } from '#decks/ui/components/deck_tabs'
import { EmptyState } from '#decks/ui/components/empty_state'
import { ImportDialog } from '#decks/ui/components/import_dialog'
import { Segmented } from '#decks/ui/components/segmented'
import type { DeckCardData, DeckDetail, DeckTab } from '#decks/ui/lib/types'

type PageProps = InertiaProps<{
  decks: DeckTab[]
  deck: DeckDetail
}>

type Filter = 'all' | 'pending' | 'owned'
type View = 'list' | 'grid'

const VIEW_KEY = 'cardlist-view'

function readView(): View {
  try {
    return localStorage.getItem(VIEW_KEY) === 'list' ? 'list' : 'grid'
  } catch {
    return 'grid'
  }
}

const sumQuantity = (cards: DeckCardData[]) => cards.reduce((sum, card) => sum + card.quantity, 0)

export default function DeckShowPage({ decks, deck }: PageProps) {
  const { t } = useTranslation()
  const [importing, setImporting] = useState(false)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [view, setView] = useState<View>('grid')
  // Local copy so checkbox/category changes show instantly; the server reply
  // (partial reload of `deck`) re-syncs it.
  const [cards, setCards] = useState(deck.cards)
  const preview = useCardPreview()

  useEffect(() => setView(readView()), [])
  useEffect(() => setCards(deck.cards), [deck.cards])

  function changeView(next: View) {
    setView(next)
    try {
      localStorage.setItem(VIEW_KEY, next)
    } catch {}
  }

  function updateCard(card: DeckCardData, changes: { owned?: boolean; category?: Category }) {
    setCards((current) => current.map((c) => (c.id === card.id ? { ...c, ...changes } : c)))
    router.patch(urlFor('decks.cards.update', { deck_id: deck.id, id: card.id }), changes, {
      preserveScroll: true,
      preserveState: true,
      only: ['deck'],
      onError: () => setCards(deck.cards),
    })
  }

  const total = sumQuantity(cards)
  const owned = sumQuantity(cards.filter((card) => card.owned))
  const pending = cards.filter((card) => !card.owned).length

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const visible = cards
      .filter((card) => !q || card.name.toLowerCase().includes(q))
      .filter((card) => filter === 'all' || (filter === 'owned' ? card.owned : !card.owned))
    return CATEGORIES.map((category) => ({
      category,
      cards: visible.filter((card) => card.category === category),
    })).filter((group) => group.cards.length > 0)
  }, [cards, query, filter])

  return (
    <AuthenticatedLayout>
      <Head title={deck.name} />
      <DeckTabs decks={decks} activeId={deck.id} onImport={() => setImporting(true)} />

      <div className="pt-7 pb-20">
        <DeckHero deckId={deck.id} name={deck.name} total={total} owned={owned} pending={pending} />

        <div className="mt-9 mb-1.5 flex flex-wrap items-center gap-2.5">
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('decks.toolbar.search')}
            aria-label={t('decks.toolbar.search')}
            className="h-10 flex-[1_1_220px] bg-card px-3.5"
          />
          <Segmented<Filter>
            variant="chips"
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: t('decks.toolbar.filters.all') },
              { value: 'pending', label: t('decks.toolbar.filters.pending') },
              { value: 'owned', label: t('decks.toolbar.filters.owned') },
            ]}
          />
          <Segmented<View>
            value={view}
            onChange={changeView}
            options={[
              { value: 'list', label: t('decks.toolbar.view.list') },
              { value: 'grid', label: t('decks.toolbar.view.grid') },
            ]}
          />
        </div>

        {groups.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title={t('decks.noResults.title')}
              action={
                <Button
                  variant="outline"
                  className="h-9 px-3.5"
                  onClick={() => {
                    setQuery('')
                    setFilter('all')
                  }}
                >
                  {t('decks.noResults.action')}
                </Button>
              }
            >
              {t('decks.noResults.body')}
            </EmptyState>
          </div>
        ) : (
          groups.map((group) => (
            <section key={group.category}>
              <CategoryHeader
                title={t(`decks.categories.${group.category}`)}
                owned={sumQuantity(group.cards.filter((card) => card.owned))}
                total={sumQuantity(group.cards)}
              />
              {view === 'list' ? (
                <div className="flex flex-col gap-2">
                  {group.cards.map((card) => (
                    <CardRow
                      key={card.id}
                      card={card}
                      onToggle={() => updateCard(card, { owned: !card.owned })}
                      onCategoryChange={(category) => updateCard(card, { category })}
                      onHoverStart={(e) => preview.start(card.name, e)}
                      onHoverMove={preview.move}
                      onHoverEnd={preview.end}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3.5 pt-1.5 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] sm:gap-7">
                  {group.cards.map((card) => (
                    <CardTile
                      key={card.id}
                      card={card}
                      onToggle={() => updateCard(card, { owned: !card.owned })}
                    />
                  ))}
                </div>
              )}
            </section>
          ))
        )}
      </div>

      {view === 'list' && <CardPreview {...preview.state} />}
      <ImportDialog open={importing} onOpenChange={setImporting} />
    </AuthenticatedLayout>
  )
}
