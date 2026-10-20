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
  activeId?: number
  onImport: () => void
}

const tab =
  'inline-flex items-center gap-2 border-2 px-3 py-1.5 text-[13px] font-bold whitespace-nowrap outline-none focus-visible:shadow-hard-sm'

export function DeckTabs({ decks, activeId, onImport }: DeckTabsProps) {
  const { t } = useTranslation()
  const [removing, setRemoving] = useState<DeckTab | null>(null)

  return (
    <nav className="flex flex-wrap gap-2 pt-6" aria-label={t('decks.title')}>
      {decks.map((deck) => {
        const active = deck.id === activeId
        return (
          <div
            key={deck.id}
            className={cn(
              tab,
              'p-0',
              active
                ? 'border-edge bg-foreground text-background shadow-hard-sm'
                : 'border-edge/40 hover:border-edge'
            )}
          >
            <Link
              href={urlFor('decks.show', { id: deck.id })}
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
              className="py-1.5 pr-2.5 opacity-55 outline-none hover:text-red hover:opacity-100 focus-visible:opacity-100"
            >
              <X className="size-3.5" strokeWidth={2.5} />
            </button>
          </div>
        )
      })}
      <button
        type="button"
        onClick={onImport}
        className={cn(tab, 'border-dashed border-edge/70 hover:border-edge')}
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
