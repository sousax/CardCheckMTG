import { BaseMail } from '@adonisjs/mail'

import env from '#start/env'
import { mailContext } from '#common/services/mail_context'

export default class ContactMessageNotification extends BaseMail {
  from = env.get('EMAIL_FROM')

  constructor(
    private contact: { name: string; email: string; message: string },
    subject: string
  ) {
    super()
    this.subject = subject
  }

  async prepare() {
    this.message
      .to(env.get('CONTACT_EMAIL') ?? env.get('EMAIL_FROM'))
      // Replying from the inbox goes straight to the visitor.
      .replyTo(this.contact.email, this.contact.name)
      .subject(this.subject!)

    this.message.htmlView('marketing::emails/contact_message', {
      ...mailContext(),
      title: this.subject,
      name: this.contact.name,
      email: this.contact.email,
      message: this.contact.message,
    })
  }
}
