import { cn } from '@workspace/ui/lib/utils'

import { useTranslation } from '#common/ui/hooks/use_translation'

import { useStamp } from '#decks/ui/lib/use_stamp'

interface StatusPillProps {
  owned: boolean
  /** "falta" (short, for card art) instead of "pendente" (lists). */
  missingLabel?: boolean
  className?: string
}

export function StatusPill({ owned, missingLabel = false, className }: StatusPillProps) {
  const { t } = useTranslation()
  const ref = useStamp<HTMLSpanElement>(owned)
  const pending = missingLabel ? t('decks.status.missing') : t('decks.status.pending')

  return (
    <span
      ref={ref}
      className={cn(
        'text-center text-[11px] font-bold tracking-[.1em] uppercase',
        owned ? 'bg-amber text-ember' : 'bg-red-strong text-cream',
        className
      )}
    >
      {owned ? t('decks.status.owned') : pending}
    </span>
  )
}
