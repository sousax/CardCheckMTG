import type React from 'react'
import { CircleAlert } from 'lucide-react'

import { cn } from '@workspace/ui/lib/utils'

interface FormAlertProps extends React.ComponentProps<'div'> {
  message: React.ReactNode
}

// Form-level error. A red edge and icon on the card surface, with body-coloured
// text, so it never reads as the filled red primary button below it.
export function FormAlert({ message, children, className, ...props }: FormAlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-2 border-2 border-red-text bg-card px-2.5 py-2 text-[13px] leading-snug font-bold text-foreground',
        className
      )}
      {...props}
    >
      <CircleAlert aria-hidden className="mt-px size-4 shrink-0 text-red-text" strokeWidth={2.5} />
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span>{message}</span>
        {children}
      </div>
    </div>
  )
}
