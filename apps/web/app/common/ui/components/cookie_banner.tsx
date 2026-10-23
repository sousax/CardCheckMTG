import { useEffect, useState } from 'react'

import { Button } from '@workspace/ui/components/button'

import { useTranslation } from '#common/ui/hooks/use_translation'

declare global {
  interface Window {
    cardlistAnalytics?: { load: () => void }
  }
}

// Keep in sync with the inline loader in inertia_layout.edge.
const STORAGE_KEY = 'cardlist-cookie-consent'
const REOPEN_EVENT = 'cardlist:cookie-preferences'

type Consent = 'granted' | 'denied'

function readConsent(): Consent | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'granted' || value === 'denied' ? value : null
  } catch {
    return null
  }
}

/** Reopens the banner, e.g. from a "Preferências de cookies" footer link. */
export function openCookiePreferences() {
  window.dispatchEvent(new Event(REOPEN_EVENT))
}

/**
 * LGPD consent for Google Analytics. Renders nothing when analytics isn't
 * configured, and only after mount: SSR can't know the stored choice.
 */
export function CookieBanner() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!window.cardlistAnalytics) return
    if (readConsent() === null) setOpen(true)
    const reopen = () => setOpen(true)
    window.addEventListener(REOPEN_EVENT, reopen)
    return () => window.removeEventListener(REOPEN_EVENT, reopen)
  }, [])

  function choose(consent: Consent) {
    const previous = readConsent()
    try {
      localStorage.setItem(STORAGE_KEY, consent)
    } catch {}
    setOpen(false)
    if (consent === 'granted') window.cardlistAnalytics?.load()
    // gtag can't be unloaded; a reload drops it after consent is revoked.
    else if (previous === 'granted') window.location.reload()
  }

  if (!open) return null

  return (
    <div
      role="region"
      aria-label={t('common.cookies.label')}
      className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-2xl flex-col gap-3 rounded-xl border border-line bg-card p-4 shadow-lg sm:flex-row sm:items-center sm:gap-5 sm:p-5"
    >
      <p className="flex-1 text-sm leading-normal text-pretty text-muted-foreground">
        {t('common.cookies.message')}
      </p>
      <div className="flex shrink-0 gap-2">
        <Button variant="outline" onClick={() => choose('denied')}>
          {t('common.cookies.decline')}
        </Button>
        <Button onClick={() => choose('granted')}>{t('common.cookies.accept')}</Button>
      </div>
    </div>
  )
}
