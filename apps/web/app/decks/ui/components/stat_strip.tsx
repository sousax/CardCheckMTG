import { cn } from '@workspace/ui/lib/utils'

interface StatStripProps {
  items: { value: number | string; label: string; accent?: boolean }[]
}

// Joined stat cells that wrap as a block: the ink background shows through
// 3px gaps, so wrapped rows keep a single shared edge instead of doubling it.
export function StatStrip({ items }: StatStripProps) {
  return (
    <div className="flex w-max max-w-full flex-wrap bg-edge pt-[3px] pl-[3px] shadow-hard-md">
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            'mr-[3px] mb-[3px] flex flex-[1_0_auto] flex-col px-5.5 py-2.5',
            item.accent ? 'bg-orange text-ember' : 'bg-card'
          )}
        >
          <b className="text-[30px] leading-none font-bold">{item.value}</b>
          <span className="mt-1 text-[11px] font-bold tracking-[.08em] uppercase opacity-80">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}
