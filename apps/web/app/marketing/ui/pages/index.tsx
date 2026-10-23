import { useState } from 'react'

import { Link } from '@adonisjs/inertia/react'
import { Head } from '@inertiajs/react'

import { Button } from '@workspace/ui/components/button'
import { cn } from '@workspace/ui/lib/utils'

import { AppLogo } from '#common/ui/components/app_logo'
import { LanguageSwitcher } from '#common/ui/components/language_switcher'
import { PaletteSwitcher } from '#common/ui/components/palette_switcher'
import { useTranslation } from '#common/ui/hooks/use_translation'

import { CardRow } from '#decks/ui/components/card_row'
import { CardTile } from '#decks/ui/components/card_tile'
import { CompletionRing } from '#decks/ui/components/completion_ring'
import { Segmented } from '#decks/ui/components/segmented'
import { StatStrip } from '#decks/ui/components/stat_strip'
import { scryfallImage } from '#decks/ui/lib/scryfall'
import type { DeckCardData } from '#decks/ui/lib/types'

const SITE_URL = 'https://mtgcardlist.com.br'

const demoCard = (
  id: number,
  name: string,
  scryfallId: string,
  quantity: number,
  owned: boolean,
  category: DeckCardData['category']
): DeckCardData => ({ id, name, scryfallId, quantity, owned, category, notFound: false })

// [card, rotation°, left %] — a hand of cards fanned behind the completion ring.
const FAN: [DeckCardData, number, number][] = [
  [
    demoCard(1, "Yuriko, the Tiger's Shadow", 'fe9be3e0-076c-4703-9750-2a6b0a178bc9', 1, false, 'creatures'),
    -9,
    0,
  ],
  [
    demoCard(2, 'Ninja of the Deep Hours', '5fea7980-55e1-47c1-ab18-a89c976b55fc', 1, true, 'creatures'),
    2,
    24,
  ],
  [
    demoCard(3, 'Counterspell', '4f616706-ec97-4923-bb1e-11a69fbaa1f8', 1, true, 'instants'),
    12,
    48,
  ],
]

const DEMO_CARDS = [
  demoCard(4, 'Lightning Bolt', '7673784e-db4b-43a1-8d55-1bb9fc1e284f', 4, false, 'instants'),
  demoCard(5, 'Sol Ring', '8ee443cc-e17a-493b-9c93-1f9e141a30e4', 1, true, 'artifacts'),
  demoCard(6, 'Treasure Cruise', '42c45880-15c7-4259-8066-c04d031d8216', 1, false, 'sorceries'),
]

const DECKS = [
  ['Gideon, Ally of Zendikar', '187e887c-c39d-4d25-a506-cdc95fc70316'],
  ['Chandra, Torch of Defiance', '40cb22c8-cb03-45c9-bb0e-b8cabdcc43cd'],
  ['Nissa, Who Shakes the World', 'f857bbe4-5619-4733-a0c7-69700f2ef4f3'],
] as const

const STEPS = ['paste', 'check', 'buy'] as const

const wrap = 'mx-auto w-full max-w-[1200px] px-4 sm:px-10'
const eyebrow =
  'self-start rounded-sm bg-amber px-2 py-1 text-xs font-bold tracking-[.14em] text-on-amber uppercase'
const h2 = 'font-display text-[clamp(44px,5.5vw,64px)] leading-[.95]'

function Copy({ tag, title, body }: { tag: string; title: string; body: string }) {
  return (
    <div className="flex flex-col gap-4">
      <span className={eyebrow}>{tag}</span>
      <h2 className={h2}>{title}</h2>
      <p className="max-w-[440px] leading-normal text-muted-foreground">{body}</p>
    </div>
  )
}

function Features() {
  const { t } = useTranslation()
  const [cards, setCards] = useState(DEMO_CARDS)
  const [view, setView] = useState<'list' | 'grid'>('list')
  const update = (id: number, patch: Partial<DeckCardData>) =>
    setCards((list) => list.map((card) => (card.id === id ? { ...card, ...patch } : card)))
  const toggle = (card: DeckCardData) => () => update(card.id, { owned: !card.owned })

  const total = cards.reduce((sum, card) => sum + card.quantity, 0)
  const owned = cards.filter((card) => card.owned).reduce((sum, card) => sum + card.quantity, 0)
  const block = 'grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-center gap-12'

  return (
    <section id="recursos" className={cn(wrap, 'flex scroll-mt-4 flex-col gap-24 py-22')}>
      <div className={block}>
        <Copy
          tag={t('marketing.features.views.tag')}
          title={t('marketing.features.views.title')}
          body={t('marketing.features.views.body')}
        />
        <div className="flex min-w-0 flex-col gap-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Segmented
              value={view}
              onChange={setView}
              options={[
                { value: 'list', label: t('decks.toolbar.view.list') },
                { value: 'grid', label: t('decks.toolbar.view.grid') },
              ]}
            />
            <span className="text-[13px] font-bold text-muted-foreground">
              {t('marketing.features.views.count', { owned, total })}
            </span>
          </div>
          {view === 'list' ? (
            <div className="flex flex-col gap-2">
              {cards.map((card) => (
                <CardRow
                  key={card.id}
                  card={card}
                  onToggle={toggle(card)}
                  onCategoryChange={(category) => update(card.id, { category })}
                  onPreview={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4.5">
              {cards.map((card) => (
                <CardTile key={card.id} card={card} onToggle={toggle(card)} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={block}>
        <div className="flex flex-wrap items-center justify-center gap-7 max-[855px]:order-last">
          <CompletionRing owned={owned} total={total} size={190} stroke={18} />
          <StatStrip
            items={[
              { value: owned, label: t('marketing.features.progress.owned') },
              { value: total - owned, label: t('marketing.features.progress.pending') },
            ]}
          />
        </div>
        <Copy
          tag={t('marketing.features.progress.tag')}
          title={t('marketing.features.progress.title')}
          body={t('marketing.features.progress.body')}
        />
      </div>

      <div className={block}>
        <Copy
          tag={t('marketing.features.decks.tag')}
          title={t('marketing.features.decks.title')}
          body={t('marketing.features.decks.body')}
        />
        <div aria-hidden className="grid grid-cols-3 gap-4">
          {DECKS.map(([name, id], i) => (
            <div
              key={id}
              className={cn(
                'overflow-hidden rounded-xl border border-line bg-card',
                i === 1 ? '-translate-y-3.5 shadow-lg' : 'shadow-md'
              )}
            >
              <img
                src={scryfallImage(name, 'art_crop', id)}
                alt=""
                loading="lazy"
                decoding="async"
                className="block aspect-[4/5] w-full border-b border-line object-cover object-[center_25%]"
              />
              <div className="truncate px-2.5 py-2 text-[11px] font-bold tracking-[.1em] uppercase">
                {name.split(',')[0]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function MarketingIndexPage() {
  const { t } = useTranslation()

  return (
    <>
      <Head title={t('marketing.meta.title')}>
        <link rel="canonical" href={`${SITE_URL}/`} />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:image" content={`${SITE_URL}/icon-512.png`} />
      </Head>

      <header className="band border-b border-line bg-red text-on-red">
        <div className={cn(wrap, 'flex flex-wrap items-center gap-x-6 gap-y-3 py-3.5')}>
          <AppLogo />
          <nav className="hidden flex-1 justify-end gap-5.5 text-[13px] font-bold md:flex">
            <a href="#como">{t('marketing.nav.how')}</a>
            <a href="#recursos">{t('marketing.nav.features')}</a>
          </nav>
          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <PaletteSwitcher />
            <LanguageSwitcher />
            <Button variant="secondary" asChild className="ml-2">
              <Link route="auth.sign_in.show">{t('marketing.nav.signin')}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="overflow-x-clip">
        <section
          className={cn(
            wrap,
            'grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-14 pt-18 pb-22'
          )}
        >
          <div className="flex flex-col gap-5.5">
            <span className={eyebrow}>{t('marketing.hero.eyebrow')}</span>
            <h1 className="font-display text-[clamp(64px,8vw,104px)] leading-[.88] text-pretty">
              {t('marketing.hero.title')}
            </h1>
            <p className="max-w-[480px] text-lg leading-normal text-muted-foreground">
              {t('marketing.hero.body')}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-3">
              <Button asChild className="h-auto px-5.5 py-3 text-[15px]">
                <Link route="auth.sign_up.show">{t('marketing.cta.start')}</Link>
              </Button>
              <Button variant="outline" asChild className="h-auto px-5.5 py-3 text-[15px]">
                <a href="#recursos">{t('marketing.cta.features')}</a>
              </Button>
            </div>
          </div>

          {/* Decorative: inert keeps the demo cards' checkboxes out of the tab order. */}
          <div aria-hidden inert className="relative h-[440px] w-full max-w-[520px] justify-self-center">
            {FAN.map(([card, rotate, left], i) => (
              <div
                key={card.id}
                className="absolute w-1/2 max-w-[230px]"
                style={{ top: 20 + i * 14, left: `${left}%`, rotate: `${rotate}deg`, zIndex: i }}
              >
                <CardTile card={card} onToggle={() => {}} />
              </div>
            ))}
            <div className="absolute right-0 -bottom-2.5 z-[5] rounded-xl border border-line bg-card p-3.5 shadow-lg">
              <CompletionRing owned={62} total={100} size={118} stroke={12} />
            </div>
          </div>
        </section>

        <section id="como" className="scroll-mt-4 border-y border-line bg-card">
          <div className={cn(wrap, 'py-18')}>
            <h2 className={cn(h2, 'mb-9')}>{t('marketing.steps.title')}</h2>
            <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-7">
              {STEPS.map((step, i) => (
                <li
                  key={step}
                  className="flex flex-col gap-3 rounded-xl border border-line bg-background p-6 shadow-md"
                >
                  <span className="flex size-12 items-center justify-center rounded-md bg-red font-display text-[30px] text-on-red">
                    {i + 1}
                  </span>
                  <h3 className="font-display text-[30px] leading-none">
                    {t(`marketing.steps.${step}.title`)}
                  </h3>
                  <p className="text-[15px] leading-normal text-muted-foreground">
                    {t(`marketing.steps.${step}.body`)}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <Features />

        <section className="band border-y border-line bg-red text-on-red">
          <div className={cn(wrap, 'flex flex-wrap items-center justify-between gap-7 py-16')}>
            <h2 className={cn(h2, 'max-w-[640px]')}>{t('marketing.final.title')}</h2>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" asChild className="h-auto px-5.5 py-3 text-[15px]">
                <Link route="auth.sign_up.show">{t('marketing.cta.signup')}</Link>
              </Button>
              <Button variant="outline" asChild className="h-auto px-5.5 py-3 text-[15px]">
                <Link route="auth.sign_in.show">{t('marketing.cta.signin')}</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer
        className={cn(
          wrap,
          'flex flex-wrap items-center justify-between gap-5 pt-7 pb-10 text-xs text-muted-foreground'
        )}
      >
        <AppLogo />
        <p className="max-w-[560px] leading-normal">{t('marketing.footer.disclaimer')}</p>
      </footer>
    </>
  )
}
