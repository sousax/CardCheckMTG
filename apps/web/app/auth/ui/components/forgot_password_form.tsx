import { Link } from '@adonisjs/inertia/react'

import { Field, FieldError, Form } from '#common/ui/components/form'
import { useTranslation } from '#common/ui/hooks/use_translation'

import { cn } from '@workspace/ui/lib/utils'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { FieldSet, FieldGroup, FieldLabel } from '@workspace/ui/components/field'
import { toast } from '@workspace/ui/hooks/use-toast'

export function ForgotPasswordForm({ className }: { className?: string }) {
  const { t } = useTranslation()

  return (
    <Form
      route="auth.forgot_password.handle"
      className={cn('flex flex-col gap-6', className)}
      resetOnSuccess
      onSuccess={() => {
        toast(t('auth.forgot_password.toast.title'), {
          description: t('auth.forgot_password.toast.description'),
        })
      }}
    >
      {({ processing, errors }) => (
        <>
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-[28px] leading-none">
              {t('auth.forgot_password.title')}
            </h2>
            <p className="text-sm text-muted-foreground">{t('auth.forgot_password.description')}</p>
          </div>

          <FieldSet>
            <FieldGroup>
              <Field name="email">
                <FieldLabel htmlFor="email">
                  {t('auth.forgot_password.form.email.label')}
                </FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t('auth.forgot_password.form.email.placeholder')}
                  required
                  aria-invalid={!!errors?.email}
                  aria-describedby={errors?.email ? 'email-error' : undefined}
                />
                <FieldError id="email-error" />
              </Field>

              <Button
                type="submit"
                className="h-auto min-h-9 w-full py-2 whitespace-normal"
                disabled={processing}
                aria-busy={processing}
              >
                {processing
                  ? t('auth.forgot_password.actions.submitting')
                  : t('auth.forgot_password.actions.submit')}
              </Button>
            </FieldGroup>
          </FieldSet>

          <p className="text-sm text-muted-foreground">
            {t('auth.forgot_password.back_to_login.text')}{' '}
            <Link
              route="auth.sign_in.show"
              className="font-bold text-red-text underline underline-offset-3"
            >
              {t('auth.forgot_password.back_to_login.login')}
            </Link>
          </p>
        </>
      )}
    </Form>
  )
}
