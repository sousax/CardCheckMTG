import type React from 'react'
import { useForm } from '@inertiajs/react'

import { Button } from '@workspace/ui/components/button'
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
      <DialogContent className="gap-3 p-5.5 sm:max-w-[520px]">
        <DialogHeader className="text-left">
          <DialogTitle className="font-display text-[28px] leading-none font-normal">
            {t('decks.import.title')}
          </DialogTitle>
          <DialogDescription className="sr-only">{t('decks.import.hint')}</DialogDescription>
        </DialogHeader>
        <form id="import-form" onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Textarea
            name="decklist"
            value={data.decklist}
            onChange={(e) => setData('decklist', e.target.value)}
            placeholder={t('decks.import.placeholder')}
            aria-invalid={!!errors.decklist}
            disabled={processing}
            autoFocus
            className="field-sizing-fixed min-h-[200px] resize-y bg-card p-3 font-mono text-[12.5px] leading-normal"
          />
          <Input
            name="name"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            placeholder={t('decks.import.namePlaceholder')}
            aria-invalid={!!errors.name}
            disabled={processing}
            className="h-10 bg-card"
          />
          {(errors.decklist || errors.name) && (
            <p role="alert" className="self-start bg-red px-2 py-1 text-xs font-bold text-cream">
              {errors.decklist ?? errors.name}
            </p>
          )}
        </form>
        <DialogFooter className="m-0 gap-2.5 border-0 bg-transparent p-0">
          <DialogClose asChild>
            <Button variant="outline" disabled={processing} className="h-9 px-3.5">
              {t('decks.import.cancel')}
            </Button>
          </DialogClose>
          <Button type="submit" form="import-form" disabled={processing} className="h-9 px-3.5">
            {processing ? t('decks.import.submitting') : t('decks.import.submit')}
          </Button>
        </DialogFooter>
        <p className="text-xs text-muted-foreground">{t('decks.import.hint')}</p>
      </DialogContent>
    </Dialog>
  )
}
