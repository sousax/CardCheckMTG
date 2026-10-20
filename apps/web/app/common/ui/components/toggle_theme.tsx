import { Moon, Sun } from 'lucide-react'

import { Button } from '@workspace/ui/components/button'
import { useTheme } from '@workspace/ui/components/theme-provider'

import { useTranslation } from '#common/ui/hooks/use_translation'

export function ToggleTheme() {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">{t('common.layout.toggleTheme')}</span>
    </Button>
  )
}
