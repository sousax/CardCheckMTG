import { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { X } from 'lucide-react'

import { cn } from '@workspace/ui/lib/utils'

import { ConfirmDialog } from '#common/ui/components/confirm_dialog'
import { useTranslation } from '#common/ui/hooks/use_translation'
import { urlFor } from '~/app/client'

import type { DeckTab } from '#decks/ui/lib/types'

interface DeckTabsProps {
  decks: DeckTab[]
  /** Omitted on the overview, where the "Meus decks" tab is the active one. */
  activeId?: number
  onImport: () => void
}

// Lives on the red band. Inactive tabs keep an ink tint so 13px cream text
// clears AA on the brand red; the active one is a cream "card".
const tab = 'inline-flex items-center gap-2 border-2 text-[13px] font-bold whitespace-nowrap'
const ACTIVE = 'border-ember bg-cream text-ember shadow-[3px_3px_0_var(--ember)]'
const INACTIVE = 'border-transparent bg-ember/20 hover:bg-ember/35'

export function DeckTabs({ decks, activeId, onImport }: DeckTabsProps) {
  const { t } = useTranslation()
  const [removing, setRemoving] = useState<DeckTab | null>(null)

  return (
    <nav className="flex flex-wrap gap-2" aria-label={t('decks.title')}>
      <Link
        href={urlFor('decks.index')}
        viewTransition
        aria-current={activeId === undefined ? 'page' : undefined}
        className={cn(tab, 'px-3 py-1.5', activeId === undefined ? ACTIVE : INACTIVE)}
      >
        {t('decks.tabs.overview')}
      </Link>
      {decks.map((deck) => {
        const active = deck.id === activeId
        return (
          <div key={deck.id} className={cn(tab, active ? ACTIVE : INACTIVE)}>
            <Link
              href={urlFor('decks.show', { id: deck.id })}
              viewTransition
              preserveScroll
              aria-current={active ? 'page' : undefined}
              className="py-1.5 pl-3 outline-none"
            >
              {deck.name}
            </Link>
            <button
              type="button"
              onClick={() => setRemoving(deck)}
              aria-label={t('decks.tabs.remove', { name: deck.name })}
              className="py-1.5 pr-2.5 opacity-55 outline-none hover:opacity-100 focus-visible:opacity-100"
            >
              <X className="size-3.5" strokeWidth={2.5} />
            </button>
          </div>
        )
      })}
      <button
        type="button"
        onClick={onImport}
        className={cn(
          tab,
          'border-dashed border-cream/70 bg-ember/20 px-3 py-1.5 hover:border-cream hover:bg-ember/35'
        )}
      >
        {t('decks.tabs.import')}
      </button>

      <ConfirmDialog
        open={removing !== null}
        onOpenChange={(open) => !open && setRemoving(null)}
        title={t('decks.delete.title')}
        desc={t('decks.delete.description', { name: removing?.name ?? '' })}
        cancelBtnText={t('decks.delete.cancel')}
        confirmText={t('decks.delete.confirm')}
        destructive
        handleConfirm={() => {
          if (!removing) return
          router.delete(urlFor('decks.destroy', { id: removing.id }), {
            onFinish: () => setRemoving(null),
          })
        }}
      />
    </nav>
  )
}
