import type { HttpContext } from '@adonisjs/core/http'

export default class MarketingController {
  async index({ inertia }: HttpContext) {
    return inertia.render('marketing/index', {})
  }
}
