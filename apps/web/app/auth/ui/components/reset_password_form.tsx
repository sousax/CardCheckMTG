import { Field, FieldError, Form } from '#common/ui/components/form'
import { useTranslation } from '#common/ui/hooks/use_translation'

import { cn } from '@workspace/ui/lib/utils'
import { Button } from '@workspace/ui/components/button'
import { PasswordInput } from '@workspace/ui/components/password-input'
import { FieldSet, FieldGroup, FieldLabel } from '@workspace/ui/components/field'

export function ResetPasswordForm({ token, className }: { token: string; className?: string }) {
  const { t } = useTranslation()

  return (
    <Form
      route="auth.reset_password.handle"
      routeParams={{ token }}
      resetOnSuccess={['password', 'passwordConfirmation']}
      resetOnError={['password', 'passwordConfirmation']}
      className={cn('flex flex-col gap-6', className)}
    >
      {({ processing, errors }) => (
        <>
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-[28px] leading-none">
              {t('auth.reset_password.title')}
            </h2>
            <p className="text-sm text-muted-foreground">{t('auth.reset_password.description')}</p>
          </div>

          <FieldSet>
            <FieldGroup>
              <Field name="password">
                <FieldLabel htmlFor="password">
                  {t('auth.reset_password.form.password.label')}
                </FieldLabel>
                <PasswordInput
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  placeholder={t('auth.reset_password.form.password.placeholder')}
                  required
                  showLabel={t('common.password.show')}
                  hideLabel={t('common.password.hide')}
                  aria-invalid={!!errors?.password}
                  aria-describedby={errors?.password ? 'password-error' : undefined}
                />
                <FieldError id="password-error" />
              </Field>

              <Field name="passwordConfirmation">
                <FieldLabel htmlFor="passwordConfirmation">
                  {t('auth.reset_password.form.password_confirmation.label')}
                </FieldLabel>
                <PasswordInput
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  autoComplete="new-password"
                  placeholder={t('auth.reset_password.form.password_confirmation.placeholder')}
                  required
                  showLabel={t('common.password.show')}
                  hideLabel={t('common.password.hide')}
                  aria-invalid={!!errors?.passwordConfirmation}
                  aria-describedby={
                    errors?.passwordConfirmation ? 'passwordConfirmation-error' : undefined
                  }
                />
                <FieldError id="passwordConfirmation-error" />
              </Field>

              <Button
                type="submit"
                className="h-auto min-h-9 w-full py-2 whitespace-normal"
                disabled={processing}
                aria-busy={processing}
              >
                {processing
                  ? t('auth.reset_password.actions.submitting')
                  : t('auth.reset_password.actions.submit')}
              </Button>
            </FieldGroup>
          </FieldSet>
        </>
      )}
    </Form>
  )
}
