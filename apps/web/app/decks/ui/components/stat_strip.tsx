import { cn } from '@workspace/ui/lib/utils'

interface StatStripProps {
  items: { value: number | string; label: string; accent?: boolean }[]
}

// Joined stat cells: the 1px gap shows the line colour behind them, so wrapped
// rows keep a single shared divider instead of doubling borders.
export function StatStrip({ items }: StatStripProps) {
  return (
    <div className="flex w-max max-w-full flex-wrap gap-px overflow-hidden rounded-lg border border-line bg-line">
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            'flex flex-[1_0_auto] flex-col gap-1 px-5 py-3',
            item.accent ? 'bg-red-tint text-red-text' : 'bg-card'
          )}
        >
          <b className="text-[30px] leading-none font-bold">{item.value}</b>
          <span
            className={cn(
              'text-[11px] font-semibold tracking-[.08em] uppercase',
              !item.accent && 'text-muted-foreground'
            )}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}
