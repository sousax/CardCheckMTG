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

const tab =
  'inline-flex items-center gap-2 rounded-md border text-[13px] font-semibold whitespace-nowrap transition-colors duration-150'
const ACTIVE = 'border-edge bg-surface-2 text-foreground'
const INACTIVE =
  'border-transparent text-muted-foreground hover:bg-surface-hover hover:text-foreground'

export function DeckTabs({ decks, activeId, onImport }: DeckTabsProps) {
  const { t } = useTranslation()
  const [removing, setRemoving] = useState<DeckTab | null>(null)

  return (
    <nav className="flex flex-wrap gap-2" aria-label={t('decks.title')}>
      <Link
        href={urlFor('decks.index')}
        viewTransition
        aria-current={activeId === undefined ? 'page' : undefined}
        className={cn(tab, 'px-3.5 py-2', activeId === undefined ? ACTIVE : INACTIVE)}
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
              className="py-2 pl-3.5 outline-none"
            >
              {deck.name}
            </Link>
            <button
              type="button"
              onClick={() => setRemoving(deck)}
              aria-label={t('decks.tabs.remove', { name: deck.name })}
              className="py-2 pr-2.5 opacity-55 outline-none hover:opacity-100 focus-visible:opacity-100"
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
          'border-dashed border-edge px-3.5 py-2 text-red-text hover:bg-red-tint'
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
