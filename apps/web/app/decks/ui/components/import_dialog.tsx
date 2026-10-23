import type React from 'react'
import { useEffect, useRef } from 'react'
import { useForm } from '@inertiajs/react'

import { Button } from '@workspace/ui/components/button'
import { Field, FieldLabel } from '@workspace/ui/components/field'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'
import { Input } from '@workspace/ui/components/input'
import { Textarea } from '@workspace/ui/components/textarea'

import { FormAlert } from '#common/ui/components/form_alert'
import { useTranslation } from '#common/ui/hooks/use_translation'
import { urlFor } from '~/app/client'

interface ImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportDialog({ open, onOpenChange }: ImportDialogProps) {
  const { t } = useTranslation()
  const { data, setData, errors, post, processing, reset, clearErrors } = useForm({
    decklist: '',
    name: '',
  })
  // Opened from several buttons via state, not a DialogTrigger, so Radix has
  // no trigger to hand focus back to; remember whoever opened it.
  const opener = useRef<HTMLElement | null>(null)
  useEffect(() => {
    if (open) opener.current = document.activeElement as HTMLElement | null
  }, [open])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (processing) return

    post(urlFor('decks.store'), {
      onSuccess: () => {
        reset()
        onOpenChange(false)
      },
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        onOpenChange(state)
        if (!state) clearErrors()
      }}
    >
      <DialogContent
        className="gap-3 p-5.5 sm:max-w-[520px]"
        onCloseAutoFocus={(e) => {
          if (!opener.current?.isConnected) return
          e.preventDefault()
          opener.current.focus()
        }}
      >
        <DialogHeader className="text-left">
          <DialogTitle className="font-display text-[28px] leading-none font-normal">
            {t('decks.import.title')}
          </DialogTitle>
          <DialogDescription className="sr-only">{t('decks.import.hint')}</DialogDescription>
        </DialogHeader>
        <form id="import-form" onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field>
            <FieldLabel htmlFor="import-decklist">{t('decks.import.listLabel')}</FieldLabel>
            <Textarea
              id="import-decklist"
              name="decklist"
              value={data.decklist}
              onChange={(e) => setData('decklist', e.target.value)}
              placeholder={t('decks.import.placeholder')}
              aria-invalid={!!errors.decklist}
              disabled={processing}
              autoFocus
              className="field-sizing-fixed min-h-[200px] resize-y bg-card p-3 font-mono text-[12.5px] leading-normal"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="import-name">{t('decks.import.nameLabel')}</FieldLabel>
            <Input
              id="import-name"
              name="name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              placeholder={t('decks.import.namePlaceholder')}
              aria-invalid={!!errors.name}
              disabled={processing}
              className="bg-card"
            />
          </Field>
          {(errors.decklist || errors.name) && (
            <FormAlert message={errors.decklist ?? errors.name} />
          )}
        </form>
        <DialogFooter className="m-0 gap-2.5 border-0 bg-transparent p-0">
          <DialogClose asChild>
            <Button variant="outline" disabled={processing}>
              {t('decks.import.cancel')}
            </Button>
          </DialogClose>
          <Button type="submit" form="import-form" disabled={processing}>
            {processing ? t('decks.import.submitting') : t('decks.import.submit')}
          </Button>
        </DialogFooter>
        <p className="text-xs text-muted-foreground">{t('decks.import.hint')}</p>
      </DialogContent>
    </Dialog>
  )
}
