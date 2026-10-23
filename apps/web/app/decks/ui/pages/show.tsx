import { useEffect, useMemo, useState } from 'react'
import { Head, router } from '@inertiajs/react'

import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'

import type { InertiaProps } from '#core/ui/types'
import AuthenticatedLayout from '#common/ui/components/authenticated_layout'
import { useTranslation } from '#common/ui/hooks/use_translation'
import { urlFor } from '~/app/client'

import { CATEGORIES, type Category } from '#decks/enums/category'
import { CardRow } from '#decks/ui/components/card_row'
import { CardStack } from '#decks/ui/components/card_stack'
import { CardTile } from '#decks/ui/components/card_tile'
import { CategoryHeader } from '#decks/ui/components/category_header'
import { DeckAside } from '#decks/ui/components/deck_aside'
import { DeckTabs } from '#decks/ui/components/deck_tabs'
import { EmptyState } from '#decks/ui/components/empty_state'
import { ImportDialog } from '#decks/ui/components/import_dialog'
import { Segmented } from '#decks/ui/components/segmented'
import { StatStrip } from '#decks/ui/components/stat_strip'
import type { DeckCardData, DeckDetail, DeckTab } from '#decks/ui/lib/types'

type PageProps = InertiaProps<{
  decks: DeckTab[]
  deck: DeckDetail
}>

type Filter = 'all' | 'pending' | 'owned'
type View = 'stacks' | 'grid' | 'list'

const VIEW_KEY = 'cardlist-view'
const VIEWS: View[] = ['stacks', 'grid', 'list']

function readView(): View {
  try {
    const saved = localStorage.getItem(VIEW_KEY) as View | null
    return saved && VIEWS.includes(saved) ? saved : 'stacks'
  } catch {
    return 'stacks'
  }
}

const sumQuantity = (cards: DeckCardData[]) => cards.reduce((sum, card) => sum + card.quantity, 0)

export default function DeckShowPage({ decks, deck }: PageProps) {
  const { t } = useTranslation()
  const [importing, setImporting] = useState(false)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [view, setView] = useState<View>('stacks')
  const [preview, setPreview] = useState<DeckCardData | null>(null)
  // Local copy so checkbox/category changes show instantly; the server reply
  // (partial reload of `deck`) re-syncs it.
  const [cards, setCards] = useState(deck.cards)

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
    setPreview((p) => (p?.id === card.id ? { ...p, ...changes } : p))
    router.patch(urlFor('decks.cards.update', { deck_id: deck.id, id: card.id }), changes, {
      preserveScroll: true,
      preserveState: true,
      only: ['deck'],
      onError: () => setCards(deck.cards),
    })
  }

  const toggle = (card: DeckCardData) => updateCard(card, { owned: !card.owned })

  // The commander is the deck's face; without one, the first decklist entry.
  const featured = cards.find((card) => card.category === 'commander') ?? cards[0]
  const total = sumQuantity(cards)
  const owned = sumQuantity(cards.filter((card) => card.owned))

  const typeStats = CATEGORIES.map((category) => {
    const ofType = cards.filter((card) => card.category === category)
    return ofType.length
      ? { value: sumQuantity(ofType), label: t(`decks.categories.${category}`) }
      : null
  })
    .filter((stat) => stat !== null)
    .slice(0, 4)

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

  const clearPreview = () => setPreview(null)

  return (
    <AuthenticatedLayout
      bandNav={<DeckTabs decks={decks} activeId={deck.id} onImport={() => setImporting(true)} />}
    >
      <Head title={deck.name} />

      <div className="grid items-start gap-10 pt-7 pb-20 max-[1000px]:gap-7 min-[1000px]:grid-cols-[300px_minmax(0,1fr)]">
        <DeckAside
          deckId={deck.id}
          featured={featured}
          preview={preview}
          owned={owned}
          total={total}
        />

        <div className="min-w-0">
          <span className="text-xs font-bold tracking-[.14em] text-red-text uppercase">
            {t('decks.hero.eyebrow', { count: cards.length })}
          </span>
          <h1
            className="mt-2.5 mb-5.5 w-fit font-display text-[clamp(48px,7vw,76px)] leading-[.9] text-balance [overflow-wrap:anywhere]"
            style={{ viewTransitionName: `deck-title-${deck.id}` }}
          >
            {deck.name}
          </h1>
          {typeStats.length > 0 && <StatStrip items={typeStats} />}

          <div className="mt-7.5 mb-6 flex flex-wrap items-center gap-2.5 border-b border-line pb-4.5">
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('decks.toolbar.search')}
              aria-label={t('decks.toolbar.search')}
              className="flex-[1_1_200px] bg-card"
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
              options={VIEWS.map((v) => ({ value: v, label: t(`decks.toolbar.view.${v}`) }))}
            />
          </div>

          {groups.length === 0 ? (
            <EmptyState
              title={t('decks.noResults.title')}
              action={
                <Button
                  variant="outline"
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
          ) : view === 'stacks' ? (
            <div className="grid grid-cols-2 items-start gap-x-3.5 gap-y-9 sm:grid-cols-[repeat(auto-fill,minmax(170px,1fr))] sm:gap-x-5.5">
              {groups.map((group) => (
                <CardStack
                  key={group.category}
                  title={t(`decks.categories.${group.category}`)}
                  cards={group.cards}
                  onToggle={toggle}
                  onPreview={setPreview}
                />
              ))}
            </div>
          ) : (
            groups.map((group) => (
              <section key={group.category} onMouseLeave={clearPreview}>
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
                        onToggle={() => toggle(card)}
                        onCategoryChange={(category) => updateCard(card, { category })}
                        onPreview={() => setPreview(card)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3.5 pt-1.5 sm:grid-cols-[repeat(auto-fill,minmax(170px,1fr))] sm:gap-6">
                    {group.cards.map((card) => (
                      <div key={card.id} onMouseEnter={() => setPreview(card)}>
                        <CardTile card={card} onToggle={() => toggle(card)} />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))
          )}
        </div>
      </div>

      <ImportDialog open={importing} onOpenChange={setImporting} />
    </AuthenticatedLayout>
  )
}
