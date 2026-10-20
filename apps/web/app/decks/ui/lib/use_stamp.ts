import { useEffect, useRef } from 'react'

const STAMP: Keyframe[] = [{ transform: 'scale(1.14)' }, { transform: 'scale(1)' }]

/**
 * Lands a status change like a rubber stamp (slightly large, then flat) each
 * time `value` flips — never on mount. Driven by the Web Animations API so
 * later re-renders (the server's partial reload) can't cut it short.
 */
export function useStamp<T extends HTMLElement>(value: unknown) {
  const ref = useRef<T>(null)
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    ref.current?.animate(STAMP, { duration: 120, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' })
  }, [value])

  return ref
}
