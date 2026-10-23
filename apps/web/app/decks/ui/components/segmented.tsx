import { cn } from '@workspace/ui/lib/utils'

interface SegmentedProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  /** chips: separate pills (filters); segmented: joined toggle (view). */
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
    <div
      className={cn(
        chips
          ? 'flex flex-wrap gap-1.5'
          : 'inline-flex gap-0.5 rounded-md border border-line bg-card p-[3px]'
      )}
      role="group"
    >
      {options.map((option) => {
        const on = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(option.value)}
            className={cn(
              'text-[13px] font-semibold transition-colors duration-150 outline-none',
              chips
                ? cn(
                    'rounded-md border px-3.5 py-2',
                    on
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-line text-muted-foreground hover:text-foreground'
                  )
                : cn(
                    'rounded-sm px-3.5 py-[7px]',
                    on
                      ? 'bg-surface-2 text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
