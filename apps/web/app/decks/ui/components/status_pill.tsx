import { cn } from '@workspace/ui/lib/utils'

import { useTranslation } from '#common/ui/hooks/use_translation'

export function StatusPill({ owned, className }: { owned: boolean; className?: string }) {
  const { t } = useTranslation()

  return (
    <span
      className={cn(
        'text-center text-[11px] font-bold tracking-[.1em] uppercase',
        owned ? 'bg-amber text-ember' : 'bg-red text-cream',
        className
      )}
    >
      {owned ? t('decks.status.owned') : t('decks.status.pending')}
    </span>
  )
}
