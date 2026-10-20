import { Link } from '@adonisjs/inertia/react'

import { cn } from '@workspace/ui/lib/utils'

import { useTranslation } from '#common/ui/hooks/use_translation'

// Sign in and sign up are separate routes; the toggle just links between them.
export function AuthModeToggle({ mode }: { mode: 'signin' | 'signup' }) {
  const { t } = useTranslation()
  const options = [
    { mode: 'signin', route: 'auth.sign_in.show', label: t('auth.layout.mode.signin') },
    { mode: 'signup', route: 'auth.sign_up.show', label: t('auth.layout.mode.signup') },
  ] as const

  return (
    <div className="flex">
      {options.map((option, i) => {
        const on = option.mode === mode
        return (
          <Link
            key={option.mode}
            route={option.route}
            aria-current={on ? 'page' : undefined}
            className={cn(
              'border-2 border-edge px-3.5 py-2 text-[13px] font-bold outline-none focus-visible:shadow-hard-sm',
              i > 0 && 'border-l-0',
              on ? 'bg-foreground text-background' : 'bg-card'
            )}
          >
            {option.label}
          </Link>
        )
      })}
    </div>
  )
}
