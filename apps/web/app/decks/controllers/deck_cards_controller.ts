import type { HttpContext } from '@adonisjs/core/http'

import UpdateDeckCard from '#decks/actions/update_deck_card'
import DeckCard from '#decks/models/deck_card'
import DeckPolicy from '#decks/policies/deck_policy'
import { updateDeckCardValidator } from '#decks/validators/deck_cards'

export default class DeckCardsController {
  async update({ bouncer, params, request, response }: HttpContext) {
    const card = await DeckCard.query()
      .where('id', params.id)
      .where('deck_id', params.deck_id)
      .preload('deck')
      .firstOrFail()
    await bouncer.with(DeckPolicy).authorize('update', card.deck)

    const payload = await request.validateUsing(updateDeckCardValidator)

    await new UpdateDeckCard().handle({ card, ...payload })

    return response.redirect().back()
  }
}
