export function CategoryHeader({
  title,
  owned,
  total,
}: {
  title: string
  owned: number
  total: number
}) {
  return (
    <div className="flex items-baseline gap-3.5 pt-7 pb-2.5">
      <h2 className="font-display text-[30px] leading-none">{title}</h2>
      <div className="flex-1 self-center border-t border-line" />
      <div className="rounded-sm bg-surface-2 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
        {owned} / {total}
      </div>
    </div>
  )
}
