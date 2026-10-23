import emitter from '@adonisjs/core/services/emitter'
import type { I18n } from '@adonisjs/i18n'

import ContactMessage from '#marketing/models/contact_message'

export interface SendContactMessageInput {
  name: string
  email: string
  message: string
  i18n: I18n
}

export default class SendContactMessage {
  // Stored first, so a failed email never loses the message.
  async handle(input: SendContactMessageInput): Promise<ContactMessage> {
    const contact = await ContactMessage.create({
      name: input.name,
      email: input.email,
      message: input.message,
    })

    emitter.emit('contact:received', {
      contact: { name: contact.name, email: contact.email, message: contact.message },
      subject: input.i18n.t('marketing.emails.contact.subject', { name: contact.name }),
    })

    return contact
  }
}
