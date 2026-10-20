import { useTranslation } from '#common/ui/hooks/use_translation'

interface CompletionRingProps {
  owned: number
  total: number
  size?: number
  stroke?: number
}

// Amber fills over a red track as cards are marked; the centre states what is
// still missing, which is the number a buyer actually cares about.
export function CompletionRing({ owned, total, size = 120, stroke = 13 }: CompletionRingProps) {
  const { t } = useTranslation()
  const pct = total ? owned / total : 0
  const missing = Math.round((1 - pct) * 100)
  const r = (size - stroke) / 2 - 3
  const circumference = 2 * Math.PI * r
  const c = size / 2

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block -rotate-90"
        aria-hidden
      >
        <circle
          cx={c}
          cy={c}
          r={r + stroke / 2 + 1.5}
          fill="var(--card)"
          stroke="var(--edge)"
          strokeWidth="3"
        />
        <circle cx={c} cy={c} r={r} fill="none" stroke="var(--red)" strokeWidth={stroke} />
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke="var(--amber)"
          strokeWidth={stroke}
          strokeDasharray={circumference.toFixed(2)}
          strokeDashoffset={(circumference * (1 - pct)).toFixed(2)}
          className="transition-[stroke-dashoffset] duration-400 ease-out motion-reduce:transition-none"
        />
        <circle
          cx={c}
          cy={c}
          r={r - stroke / 2 - 1.5}
          fill="var(--background)"
          stroke="var(--edge)"
          strokeWidth="3"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        {missing === 0 ? (
          <span
            className="font-display leading-none text-foreground dark:text-amber"
            style={{ fontSize: size * 0.2 }}
          >
            {t('decks.ring.complete')}
          </span>
        ) : (
          <>
            {/* The label doesn't fit inside small rings; there the % stands alone. */}
            {size >= 96 && (
              <span className="text-[10px] font-bold tracking-[.1em] text-muted-foreground uppercase">
                {t('decks.ring.missing')}
              </span>
            )}
            <span
              className="font-display leading-[.9] text-red-text"
              style={{ fontSize: size * 0.3 }}
            >
              {missing}%
            </span>
          </>
        )}
      </div>
    </div>
  )
}
