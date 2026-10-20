import { cn } from '@workspace/ui/lib/utils'

interface RowCheckProps {
  checked: boolean
  label: string
  onToggle: () => void
  className?: string
}

export function RowCheck({ checked, label, onToggle, className }: RowCheckProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      className={cn(
        'flex size-6 shrink-0 cursor-pointer items-center justify-center border-2 border-edge text-ember transition-colors duration-[120ms] outline-none focus-visible:shadow-hard-sm',
        checked ? 'bg-amber' : 'bg-background',
        className
      )}
    >
      <svg viewBox="0 0 12 12" fill="none" className="size-3">
        {/* pathLength=1 lets the dash offset draw the tick in, start to end. */}
        <path
          d="M2 6.5L4.7 9L10 3"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={checked ? 0 : 1}
          className="transition-[stroke-dashoffset] duration-150 ease-out"
        />
      </svg>
    </button>
  )
}
