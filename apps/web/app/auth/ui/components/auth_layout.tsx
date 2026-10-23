import React from 'react'

import { Toaster } from '@workspace/ui/components/sonner'
import { cn } from '@workspace/ui/lib/utils'

import { AppLogo } from '#common/ui/components/app_logo'
import { LanguageSwitcher } from '#common/ui/components/language_switcher'
import { PaletteSwitcher } from '#common/ui/components/palette_switcher'
import { useTranslation } from '#common/ui/hooks/use_translation'

const art = (name: string) =>
  `https://api.scryfall.com/cards/named?format=image&version=art_crop&fuzzy=${encodeURIComponent(name)}`

const CHARACTERS = ['Chandra, Torch of Defiance', 'Jace, the Mind Sculptor', 'Liliana of the Veil']

export interface AuthLayoutProps extends React.PropsWithChildren {}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation()

  return (
    <>
      <Toaster />

      <div className="flex min-h-svh flex-col">
        <header className="band border-b border-line bg-red text-on-red">
          <div className="flex items-center justify-between gap-5 px-4 py-4 sm:px-10">
            <AppLogo />
            <div className="flex items-center gap-1">
              <PaletteSwitcher />
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        <main className="mx-auto grid w-full max-w-[1180px] flex-1 grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-14 px-4 py-12 sm:px-10 lg:py-20">
          <section className="flex flex-col gap-5.5">
            <span className="self-start rounded-sm bg-amber px-2 py-1 text-xs font-bold tracking-[.14em] text-on-amber uppercase">
              {t('auth.layout.hero.eyebrow')}
            </span>
            <h1 className="m-0 font-display text-[clamp(56px,7vw,92px)] leading-[.9] text-balance">
              {t('auth.layout.hero.title')}
            </h1>
            <p className="max-w-[440px] text-base leading-normal text-muted-foreground">
              {t('auth.layout.hero.body')}
            </p>
            <div className="mt-2 flex gap-4.5 pb-[18px]">
              {CHARACTERS.map((name, i) => (
                <div
                  key={name}
                  aria-hidden
                  className={cn(
                    'aspect-[4/5] max-w-[150px] flex-1 rounded-xl border border-line bg-cover bg-[center_25%]',
                    i === 0 ? 'shadow-lg' : 'shadow-md',
                    i === 1 && 'translate-y-[18px]'
                  )}
                  style={{ backgroundImage: `url("${art(name)}")` }}
                />
              ))}
            </div>
          </section>

          <div className="w-full max-w-[440px] justify-self-center rounded-xl border border-line bg-card p-5.5 shadow-md">
            {children}
          </div>
        </main>
      </div>
    </>
  )
}
