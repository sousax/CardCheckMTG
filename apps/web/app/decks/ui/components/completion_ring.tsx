import { useTranslation } from '#common/ui/hooks/use_translation'

interface CompletionRingProps {
  owned: number
  total: number
  size?: number
  stroke?: number
}

// The owned colour fills over an accent-tint track as cards are marked; the
// centre states what is still missing, which is the number a buyer cares about.
export function CompletionRing({ owned, total, size = 120, stroke = 13 }: CompletionRingProps) {
  const { t } = useTranslation()
  const pct = total ? owned / total : 0
  const missing = Math.round((1 - pct) * 100)
  const r = (size - stroke) / 2 - 2
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
        <circle cx={c} cy={c} r={r} fill="none" stroke="var(--red-tint)" strokeWidth={stroke} />
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke="var(--amber)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference.toFixed(2)}
          strokeDashoffset={(circumference * (1 - pct)).toFixed(2)}
          className="transition-[stroke-dashoffset] duration-400 ease-out motion-reduce:transition-none"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        {missing === 0 ? (
          <span
            className="font-display leading-none text-amber-text"
            style={{ fontSize: size * 0.2 }}
          >
            {t('decks.ring.complete')}
          </span>
        ) : (
          <>
            <span className="leading-none font-bold" style={{ fontSize: size * 0.26 }}>
              {missing}%
            </span>
            {/* The label doesn't fit inside small rings; there the % stands alone. */}
            {size >= 80 && (
              <span
                className="font-semibold text-muted-foreground"
                style={{ fontSize: Math.max(10, size * 0.085) }}
              >
                {t('decks.ring.missing')}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  )
}
