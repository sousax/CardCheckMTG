import type React from 'react'
import { useRef, useState } from 'react'

import { cn } from '@workspace/ui/lib/utils'

import { useTranslation } from '#common/ui/hooks/use_translation'

import { scryfallImage } from '#decks/ui/lib/scryfall'

// ms resting on a row before the card pops up
const HOVER_DELAY = 550
const PREVIEW_W = 260
const PREVIEW_H = 350

export function useCardPreview() {
  const [state, setState] = useState({ show: false, name: '', x: 0, y: 0 })
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const move = (e: React.MouseEvent) => {
    const pad = 18
    let x = e.clientX + pad
    let y = e.clientY + pad
    if (x + PREVIEW_W > window.innerWidth) x = e.clientX - PREVIEW_W - pad
    if (y + PREVIEW_H > window.innerHeight) y = window.innerHeight - PREVIEW_H - 10
    setState((s) => ({ ...s, x, y }))
  }

  return {
    state,
    start: (name: string, e: React.MouseEvent) => {
      clearTimeout(timer.current)
      move(e)
      timer.current = setTimeout(() => setState((s) => ({ ...s, show: true, name })), HOVER_DELAY)
    },
    move,
    end: () => {
      clearTimeout(timer.current)
      setState((s) => ({ ...s, show: false }))
    },
  }
}

export function CardPreview({ show, name, x, y }: ReturnType<typeof useCardPreview>['state']) {
  const { t } = useTranslation()
  const [failedFor, setFailedFor] = useState<string | null>(null)

  return (
    <div
      aria-hidden
      style={{ left: x, top: y }}
      className={cn(
        'pointer-events-none fixed z-50 w-60 border-[3px] border-edge bg-card shadow-hard-lg transition-[opacity,transform] duration-[120ms]',
        show ? 'opacity-100' : 'scale-[.96] opacity-0'
      )}
    >
      {name && failedFor !== name ? (
        <img
          src={scryfallImage(name)}
          alt=""
          className="block w-full"
          onError={() => setFailedFor(name)}
        />
      ) : (
        <div className="flex aspect-[5/7] items-center justify-center p-4 text-center text-xs font-bold text-muted-foreground">
          {t('decks.card.notFound')}
        </div>
      )}
    </div>
  )
}
