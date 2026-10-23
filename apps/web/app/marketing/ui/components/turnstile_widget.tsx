import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId?: string) => void
      remove: (widgetId: string) => void
    }
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

let scriptLoad: Promise<void> | null = null

function loadScript() {
  scriptLoad ??= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      scriptLoad = null
      reject(new Error('turnstile script failed to load'))
    }
    document.head.appendChild(script)
  })
  return scriptLoad
}

/**
 * Explicit render instead of the auto-scan: Inertia can mount this page
 * without a full load, and the auto-scan only runs once per document.
 * The widget injects a hidden `cf-turnstile-response` input into the form.
 */
export function TurnstileWidget({ siteKey, language }: { siteKey: string; language: string }) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let widgetId: string | undefined
    let cancelled = false

    loadScript()
      .then(() => {
        if (cancelled || !container.current || !window.turnstile) return
        widgetId = window.turnstile.render(container.current, {
          sitekey: siteKey,
          // Turnstile names Brazilian Portuguese pt-br; the app calls it pt.
          language: language === 'pt' ? 'pt-br' : language,
          theme: document.documentElement.dataset.palette === 'linho' ? 'light' : 'dark',
        })
      })
      .catch(() => {})

    return () => {
      cancelled = true
      if (widgetId) window.turnstile?.remove(widgetId)
    }
  }, [siteKey, language])

  return <div ref={container} className="min-h-[65px]" />
}
