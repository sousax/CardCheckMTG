import React from 'react'

import { ModalRoot } from 'adonis-inertia-modal/react'
import { Toaster } from '@workspace/ui/components/sonner'

import { AppLogo } from '#common/ui/components/app_logo'
import Breadcrumb from '#common/ui/components/breadcrumbs'
import { NavHeaderMain } from '#common/ui/components/nav_header_main'
import { NavHeaderMobile } from '#common/ui/components/nav_header_mobile'
import { NavUser } from '#common/ui/components/nav_user'
import { LanguageSwitcher } from '#common/ui/components/language_switcher'
import { NotificationBell } from '#common/ui/components/notification_bell'
import { PaletteSwitcher } from '#common/ui/components/palette_switcher'

import useUser from '#auth/ui/hooks/use_user'
import useFlashToasts from '#common/ui/hooks/use_flash_toasts'
import { useTranslation } from '#common/ui/hooks/use_translation'

import { getMainNav, getNavUser } from '#common/ui/config/navigation.config'

interface BreadcrumbItemProps {
  label: string
  href?: string
}

interface AuthenticatedLayoutProps extends React.PropsWithChildren {
  breadcrumbs?: BreadcrumbItemProps[]
  /** Page-owned content for the band (e.g. deck tabs); replaces the main nav. */
  bandNav?: React.ReactNode
}

const EMPTY_BREADCRUMBS: BreadcrumbItemProps[] = []

export default function AuthenticatedLayout({
  children,
  breadcrumbs = EMPTY_BREADCRUMBS,
  bandNav,
}: AuthenticatedLayoutProps) {
  const user = useUser()
  const { t } = useTranslation()
  const navMain = getMainNav(t)
  const navUser = getNavUser(t)

  useFlashToasts()

  if (!user) {
    return null
  }

  return (
    <>
      <Toaster />
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-red px-3 py-2 text-sm font-semibold text-on-red focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {t('common.layout.skipToContent')}
      </a>
      <div className="min-h-svh flex flex-col">
        <header className="shrink-0 border-b border-line bg-background">
          <div className="mx-auto flex min-h-[72px] flex-wrap items-center gap-x-8 gap-y-2 px-4 py-3 max-w-[1360px] sm:px-10">
            <NavHeaderMobile items={navMain} />

            <AppLogo />

            {bandNav ? (
              <div className="order-last flex min-w-0 basis-full lg:order-none lg:flex-1 lg:basis-auto">
                {bandNav}
              </div>
            ) : (
              <div className="hidden h-full items-center lg:flex">
                <NavHeaderMain items={navMain} />
              </div>
            )}

            <div className="ml-auto flex items-center gap-1">
              <NotificationBell />
              <PaletteSwitcher />
              <LanguageSwitcher />
              <NavUser user={user} options={navUser} />
            </div>
          </div>
        </header>

        {breadcrumbs.length > 0 && (
          <div className="border-b border-line shrink-0">
            <div className="mx-auto flex h-12 w-full items-center px-4 max-w-[1360px] sm:px-10">
              <Breadcrumb breadcrumbs={breadcrumbs} />
            </div>
          </div>
        )}

        <main
          id="main"
          tabIndex={-1}
          className="mx-auto flex w-full max-w-[1360px] outline-none flex-1 flex-col gap-4 px-4 sm:px-10"
        >
          {children}
        </main>
      </div>
      <ModalRoot />
    </>
  )
}
