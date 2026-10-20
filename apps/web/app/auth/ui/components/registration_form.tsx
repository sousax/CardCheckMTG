import { usePage } from '@inertiajs/react'

import { Field, FieldError, Form } from '#common/ui/components/form'
import { FormAlert } from '#common/ui/components/form_alert'
import { useTranslation } from '#common/ui/hooks/use_translation'

import { cn } from '@workspace/ui/lib/utils'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { FieldSet, FieldGroup, FieldLabel } from '@workspace/ui/components/field'

import { PasswordInput } from '@workspace/ui/components/password-input'

import { AuthModeToggle } from '#auth/ui/components/auth_mode_toggle'

export function RegistrationForm({ className }: { className?: string }) {
  const { t } = useTranslation()

  const { error: errorMessage } = usePage().flash

  return (
    <Form
      route="auth.sign_up.handle"
      resetOnSuccess={['password', 'passwordConfirmation']}
      resetOnError={['password', 'passwordConfirmation']}
      className={cn('flex flex-col gap-6', className)}
    >
      {({ processing, errors }) => (
        <>
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-[28px] leading-none">
              {t('auth.registration.title')}
            </h2>
            <AuthModeToggle mode="signup" />
          </div>

          <FieldSet>
            <FieldGroup>
              <Field name="fullName">
                <FieldLabel htmlFor="fullName">
                  {t('auth.registration.form.full_name.label')}
                </FieldLabel>
                <Input
                  id="fullName"
                  autoComplete="name"
                  name="fullName"
                  type="text"
                  placeholder={t('auth.registration.form.full_name.placeholder')}
                  required
                  aria-invalid={!!errors?.fullName}
                  aria-describedby={errors?.fullName ? 'fullName-error' : undefined}
                />
                <FieldError id="fullName-error" />
              </Field>

              <Field name="email">
                <FieldLabel htmlFor="email">{t('auth.registration.form.email.label')}</FieldLabel>
                <Input
                  id="email"
                  autoComplete="email"
                  name="email"
                  type="email"
                  placeholder={t('auth.registration.form.email.placeholder')}
                  required
                  aria-invalid={!!errors?.email}
                  aria-describedby={errors?.email ? 'email-error' : undefined}
                />
                <FieldError id="email-error" />
              </Field>

              <Field name="password">
                <FieldLabel htmlFor="password">
                  {t('auth.registration.form.password.label')}
                </FieldLabel>
                <PasswordInput
                  id="password"
                  autoComplete="new-password"
                  showLabel={t('common.password.show')}
                  hideLabel={t('common.password.hide')}
                  name="password"
                  placeholder={t('auth.registration.form.password.placeholder')}
                  required
                  aria-invalid={!!errors?.password}
                  aria-describedby={errors?.password ? 'password-error' : undefined}
                />
                <FieldError id="password-error" />
              </Field>

              <Field name="passwordConfirmation">
                <FieldLabel htmlFor="passwordConfirmation">
                  {t('auth.registration.form.password_confirmation.label')}
                </FieldLabel>
                <PasswordInput
                  id="passwordConfirmation"
                  autoComplete="new-password"
                  showLabel={t('common.password.show')}
                  hideLabel={t('common.password.hide')}
                  name="passwordConfirmation"
                  placeholder={t('auth.registration.form.password_confirmation.placeholder')}
                  required
                  aria-invalid={!!errors?.passwordConfirmation}
                  aria-describedby={
                    errors?.passwordConfirmation ? 'passwordConfirmation-error' : undefined
                  }
                />
                <FieldError id="passwordConfirmation-error" />
              </Field>

              {errorMessage && <FormAlert message={errorMessage} />}

              <Button
                type="submit"
                className="h-auto min-h-9 w-full py-2 whitespace-normal"
                disabled={processing}
                aria-busy={processing}
              >
                {processing
                  ? t('auth.registration.actions.submitting')
                  : t('auth.registration.actions.submit')}
              </Button>
            </FieldGroup>
          </FieldSet>
        </>
      )}
    </Form>
  )
}
