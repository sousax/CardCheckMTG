import React from 'react'

import { Toaster } from '@workspace/ui/components/sonner'

import { AppLogo } from '#common/ui/components/app_logo'
import { LanguageSwitcher } from '#common/ui/components/language_switcher'

// Planeswalker art hotlinked from Scryfall, framed like the deck hero.
const ART =
  'https://api.scryfall.com/cards/named?format=image&version=art_crop&fuzzy=Jace%2C+the+Mind+Sculptor'

export interface AuthLayoutProps extends React.PropsWithChildren {}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <Toaster />

      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex items-center justify-between">
            <AppLogo />
            <LanguageSwitcher />
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">{children}</div>
          </div>
        </div>
        <div className="relative hidden border-l-[3px] border-edge bg-red lg:block">
          <div className="absolute inset-0 flex items-center justify-center p-16">
            <div
              aria-hidden
              className="aspect-[4/3] w-full max-w-xl border-[3px] border-edge bg-cover bg-center shadow-[8px_8px_0_var(--ember)]"
              style={{ backgroundImage: `url("${ART}")` }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
