import { cn } from '@workspace/ui/lib/utils'

import { useTranslation } from '#common/ui/hooks/use_translation'

import { characterArt } from '#decks/ui/lib/scryfall'

interface DeckHeroProps {
  deckId: number
  name: string
  total: number
  owned: number
  pending: number
}

export function DeckHero({ deckId, name, total, owned, pending }: DeckHeroProps) {
  const { t } = useTranslation()
  const percent = total === 0 ? 0 : Math.round((owned / total) * 100)
  const stats = [
    { value: owned, label: t('decks.stats.owned') },
    { value: pending, label: t('decks.stats.pending') },
    { value: `${percent}%`, label: t('decks.stats.complete'), accent: true },
  ]

  return (
    <section className="grid items-center gap-9 md:grid-cols-[minmax(0,1fr)_minmax(220px,360px)]">
      <div className="min-w-0">
        <span className="inline-block bg-amber px-2 py-1 text-xs font-bold tracking-[.14em] text-ember uppercase">
          {t('decks.hero.eyebrow', { count: total })}
        </span>
        <h1 className="mt-3.5 mb-5 font-display text-[clamp(52px,9vw,92px)] leading-[.9] text-balance [overflow-wrap:anywhere]">
          {name}
        </h1>
        <div className="flex w-max max-w-full border-[3px] border-edge shadow-hard-md">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                'flex flex-col px-3 py-2.5 sm:px-5.5',
                i > 0 && 'border-l-[3px] border-edge',
                stat.accent ? 'bg-orange text-ember' : 'bg-card'
              )}
            >
              <b className="text-2xl leading-none sm:text-[30px]">{stat.value}</b>
              <span className="mt-1 text-[11px] font-bold tracking-[.08em] uppercase opacity-80">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div
        aria-hidden
        className="h-[190px] border-[3px] border-edge bg-card bg-cover bg-[center_25%] shadow-hard-lg"
        style={{ backgroundImage: `url("${characterArt(deckId)}")` }}
      />
    </section>
  )
}
