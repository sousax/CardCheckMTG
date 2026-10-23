import logger from '@adonisjs/core/services/logger'

import env from '#start/env'

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export default class Turnstile {
  /**
   * Checks a widget token with Cloudflare. Fails closed: if Cloudflare can't
   * be reached the submission is refused rather than let through unchecked.
   */
  async verify(token: string, ip: string): Promise<boolean> {
    try {
      const response = await fetch(VERIFY_URL, {
        method: 'POST',
        body: new URLSearchParams({
          secret: env.get('TURNSTILE_SECRET_KEY'),
          response: token,
          remoteip: ip,
        }),
        signal: AbortSignal.timeout(5_000),
      })
      const body = (await response.json()) as { success?: boolean }
      return body.success === true
    } catch (error) {
      logger.warn({ err: error }, 'turnstile verification failed')
      return false
    }
  }
}
