import type { HttpContext } from '@adonisjs/core/http'
import limiter from '@adonisjs/limiter/services/main'
import { DateTime } from 'luxon'

import SendContactMessage from '#marketing/actions/send_contact_message'
import ContactMessage from '#marketing/models/contact_message'
import Turnstile from '#marketing/services/turnstile'
import { createContactMessageValidator } from '#marketing/validators/contact_messages'

// Last line of defence if the captcha is ever beaten: caps inbox and mail quota.
const DAILY_LIMIT = 50

export default class ContactMessagesController {
  private contactLimiter = limiter.use({ requests: 3, duration: '10 mins' })

  constructor(private turnstile = new Turnstile()) {}

  async store({ i18n, request, response, session }: HttpContext) {
    const {
      website,
      'cf-turnstile-response': captcha,
      ...payload
    } = await request.validateUsing(createContactMessageValidator)

    // Bots get the same success response, so they learn nothing.
    if (website) {
      session.flash('success', i18n.t('marketing.contact.sent'))
      return response.redirect().back()
    }

    if (!captcha || !(await this.turnstile.verify(captcha, request.ip()))) {
      session.flash('error', i18n.t('marketing.contact.captchaFailed'))
      return response.redirect().back()
    }

    const today = await ContactMessage.query()
      .where('created_at', '>=', DateTime.now().startOf('day').toSQL()!)
      .count('* as total')
      .first()
    if (Number(today?.$extras.total ?? 0) >= DAILY_LIMIT) {
      session.flash('error', i18n.t('marketing.contact.dailyLimit'))
      return response.redirect().back()
    }

    const sent = await this.contactLimiter.attempt(`contact_${request.ip()}`, () =>
      new SendContactMessage().handle({ ...payload, i18n })
    )
    if (!sent) {
      session.flash('error', i18n.t('errors.E_TOO_MANY_REQUESTS'))
      return response.redirect().back()
    }

    session.flash('success', i18n.t('marketing.contact.sent'))
    return response.redirect().back()
  }
}
