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
      <div className="flex-1 self-center border-t-2 border-edge opacity-25" />
      <div className="border-2 border-edge px-2 py-0.5 text-xs font-bold">
        {owned} / {total}
      </div>
    </div>
  )
}
