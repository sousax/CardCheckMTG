import { useEffect, useState } from 'react'

import { Button } from '@workspace/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { useTheme } from '@workspace/ui/components/theme-provider'
import { cn } from '@workspace/ui/lib/utils'

import { useTranslation } from '#common/ui/hooks/use_translation'

// Swatches: background, accent, second accent, owned. Keep the ids in sync
// with the [data-palette] blocks in globals.css and the inline script in
// inertia_layout.edge.
const PALETTES = [
  { id: 'brasa', swatches: ['#17110f', '#e2725b', '#f2b880', '#9cc5a1'] },
  { id: 'noite', swatches: ['#0f1220', '#e6ad55', '#9db1ff', '#7fd1ae'] },
  { id: 'floresta', swatches: ['#0f1513', '#e07a5f', '#d9a441', '#6fbf8e'] },
  { id: 'linho', swatches: ['#f5f1ea', '#c8553d', '#2f6f73', '#221c18'] },
] as const

type PaletteId = (typeof PALETTES)[number]['id']

const STORAGE_KEY = 'cardlist-palette'

function readPalette(): PaletteId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return PALETTES.find((p) => p.id === saved)?.id ?? 'brasa'
  } catch {
    return 'brasa'
  }
}

function Swatches({ colors, size }: { colors: readonly string[]; size: string }) {
  return (
    <span className="inline-flex">
      {colors.map((color, i) => (
        <span
          key={color}
          className={cn('rounded-full border border-[rgba(128,128,128,.35)]', size, i && '-ml-[3px]')}
          style={{ background: color }}
        />
      ))}
    </span>
  )
}

export function PaletteSwitcher() {
  const { t } = useTranslation()
  const { setTheme } = useTheme()
  const [palette, setPalette] = useState<PaletteId>('brasa')

  function apply(id: PaletteId) {
    setPalette(id)
    document.documentElement.dataset.palette = id
    // `dark:` variants still key off the class; Linho is the one light palette.
    setTheme(id === 'linho' ? 'light' : 'dark')
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch {}
  }

  // Read after mount: SSR has no storage, and the theme provider may have
  // restored a stale light/dark choice that must follow the palette.
  useEffect(() => apply(readPalette()), [])

  const current = PALETTES.find((p) => p.id === palette)!

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-8 gap-2 border-line px-2.5 text-xs text-muted-foreground in-[.band]:border-current in-[.band]:text-on-red in-[.band]:hover:bg-black/10">
          <Swatches colors={current.swatches.slice(1)} size="size-2.5" />
          <span className="hidden sm:inline">{t(`common.layout.palettes.${palette}`)}</span>
          <span className="sr-only sm:hidden">{t('common.layout.palette')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto min-w-[210px]">
        {PALETTES.map(({ id, swatches }) => (
          <DropdownMenuItem
            key={id}
            onClick={() => apply(id)}
            className={cn('gap-2.5 py-2 font-semibold', id === palette && 'bg-surface-2')}
          >
            <Swatches colors={swatches} size="size-3" />
            <span className="flex-1">{t(`common.layout.palettes.${id}`)}</span>
            {id === 'brasa' && (
              <span className="text-[10px] font-medium text-muted-foreground">
                {t('common.layout.paletteDefault')}
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
