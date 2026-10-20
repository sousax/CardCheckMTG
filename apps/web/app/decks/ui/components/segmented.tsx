import { cn } from '@workspace/ui/lib/utils'

interface SegmentedProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  /** chips: separate amber pills (filters); segmented: joined ink toggle (view). */
  variant?: 'chips' | 'segmented'
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  variant = 'segmented',
}: SegmentedProps<T>) {
  const chips = variant === 'chips'

  return (
    <div className={cn('flex', chips && 'gap-1.5')} role="group">
      {options.map((option, i) => {
        const on = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(option.value)}
            className={cn(
              'border-2 border-edge px-3.5 py-2 text-[13px] font-bold transition-shadow duration-[120ms] outline-none focus-visible:shadow-hard-sm',
              !chips && i > 0 && 'border-l-0',
              chips
                ? on
                  ? 'bg-amber text-ember shadow-hard-sm'
                  : 'bg-card'
                : on
                  ? 'bg-foreground text-background'
                  : 'bg-card'
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
