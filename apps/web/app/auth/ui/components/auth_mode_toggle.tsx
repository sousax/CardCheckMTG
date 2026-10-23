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
    <div className="inline-flex gap-0.5 self-start rounded-md border border-line bg-card p-[3px]">
      {options.map((option) => {
        const on = option.mode === mode
        return (
          <Link
            key={option.mode}
            route={option.route}
            aria-current={on ? 'page' : undefined}
            className={cn(
              'rounded-sm px-3.5 py-[7px] text-[13px] font-semibold outline-none transition-colors duration-150',
              on ? 'bg-surface-2 text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {option.label}
          </Link>
        )
      })}
    </div>
  )
}
