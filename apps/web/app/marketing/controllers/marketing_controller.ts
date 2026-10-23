import type { HttpContext } from '@adonisjs/core/http'

import env from '#start/env'

export default class MarketingController {
  async index({ inertia }: HttpContext) {
    return inertia.render('marketing/index', {
      turnstileSiteKey: env.get('TURNSTILE_SITE_KEY'),
    })
  }
}
