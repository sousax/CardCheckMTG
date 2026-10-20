import { useState } from 'react'
import { Head } from '@inertiajs/react'

import { Button } from '@workspace/ui/components/button'

import type { InertiaProps } from '#core/ui/types'
import AuthenticatedLayout from '#common/ui/components/authenticated_layout'
import { useTranslation } from '#common/ui/hooks/use_translation'

import { DeckTabs } from '#decks/ui/components/deck_tabs'
import { EmptyState } from '#decks/ui/components/empty_state'
import { ImportDialog } from '#decks/ui/components/import_dialog'

export default function DecksIndexPage(_props: InertiaProps) {
  const { t } = useTranslation()
  const [importing, setImporting] = useState(false)

  return (
    <AuthenticatedLayout>
      <Head title={t('decks.title')} />
      <DeckTabs decks={[]} onImport={() => setImporting(true)} />
      <div className="pt-7 pb-20">
        <EmptyState
          title={t('decks.empty.title')}
          action={
            <Button onClick={() => setImporting(true)} className="h-9 px-3.5">
              {t('decks.empty.action')}
            </Button>
          }
        >
          {t('decks.empty.body')}
        </EmptyState>
      </div>
      <ImportDialog open={importing} onOpenChange={setImporting} />
    </AuthenticatedLayout>
  )
}
