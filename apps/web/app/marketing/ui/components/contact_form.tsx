import { Button } from '@workspace/ui/components/button'
import { FieldGroup, FieldLabel } from '@workspace/ui/components/field'
import { Input } from '@workspace/ui/components/input'
import { Textarea } from '@workspace/ui/components/textarea'

import { Field, FieldError, Form } from '#common/ui/components/form'
import { useTranslation } from '#common/ui/hooks/use_translation'

import { TurnstileWidget } from '#marketing/ui/components/turnstile_widget'

export function ContactForm({ turnstileSiteKey }: { turnstileSiteKey: string }) {
  const { t, language } = useTranslation()

  return (
    <Form
      route="contact.store"
      resetOnSuccess
      options={{ preserveScroll: true }}
      // Each token is single-use: a fresh challenge after every submit.
      onFinish={() => window.turnstile?.reset()}
      className="flex flex-col gap-5 rounded-xl border border-line bg-card p-5.5 shadow-md sm:p-7"
    >
      {({ processing, errors }) => (
        <>
          <FieldGroup>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field name="name">
                <FieldLabel htmlFor="contact-name">{t('marketing.contact.name')}</FieldLabel>
                <Input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  aria-invalid={!!errors?.name}
                  aria-describedby={errors?.name ? 'contact-name-error' : undefined}
                />
                <FieldError id="contact-name-error" />
              </Field>
              <Field name="email">
                <FieldLabel htmlFor="contact-email">{t('marketing.contact.email')}</FieldLabel>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  aria-invalid={!!errors?.email}
                  aria-describedby={errors?.email ? 'contact-email-error' : undefined}
                />
                <FieldError id="contact-email-error" />
              </Field>
            </div>
            <Field name="message">
              <FieldLabel htmlFor="contact-message">{t('marketing.contact.message')}</FieldLabel>
              <Textarea
                id="contact-message"
                name="message"
                required
                minLength={10}
                maxLength={5000}
                placeholder={t('marketing.contact.messagePlaceholder')}
                aria-invalid={!!errors?.message}
                aria-describedby={errors?.message ? 'contact-message-error' : undefined}
                className="field-sizing-fixed min-h-36 resize-y"
              />
              <FieldError id="contact-message-error" />
            </Field>
          </FieldGroup>

          {/* Honeypot: off-screen and out of the tab order, so only bots fill it. */}
          <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="contact-website">Website</label>
            <input
              id="contact-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <TurnstileWidget siteKey={turnstileSiteKey} language={language} />

          <Button
            type="submit"
            disabled={processing}
            aria-busy={processing}
            className="h-auto self-start px-5.5 py-3 text-[15px]"
          >
            {processing ? t('marketing.contact.submitting') : t('marketing.contact.submit')}
          </Button>
        </>
      )}
    </Form>
  )
}
