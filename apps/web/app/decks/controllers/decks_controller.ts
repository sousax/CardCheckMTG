import type { HttpContext } from '@adonisjs/core/http'

import DeleteDeck from '#decks/actions/delete_deck'
import ImportDeck from '#decks/actions/import_deck'
import Deck from '#decks/models/deck'
import DeckPolicy from '#decks/policies/deck_policy'
import GetShoppingList from '#decks/queries/get_shopping_list'
import DeckTransformer from '#decks/transformers/deck_transformer'
import { createDeckValidator } from '#decks/validators/decks'

export default class DecksController {
  async index({ auth, bouncer, inertia }: HttpContext) {
    await bouncer.with(DeckPolicy).authorize('viewList')

    const decks = await this.userDecks(auth.getUserOrFail().id).preload('cards', (cards) =>
      cards.orderBy('id')
    )

    return inertia.render('decks/index', {
      decks: DeckTransformer.transform(decks).useVariant('forOverview'),
      shoppingList: new GetShoppingList().handle(decks),
    })
  }

  async show({ auth, bouncer, inertia, params }: HttpContext) {
    const deck = await Deck.query()
      .where('id', params.id)
      .preload('cards', (cards) => cards.orderBy('id'))
      .firstOrFail()
    await bouncer.with(DeckPolicy).authorize('view', deck)

    const decks = await this.userDecks(auth.getUserOrFail().id)

    return inertia.render('decks/show', {
      decks: DeckTransformer.transform(decks).useVariant('forTabs'),
      deck: DeckTransformer.transform(deck).useVariant('forShow'),
    })
  }

  async store({ auth, bouncer, i18n, request, response }: HttpContext) {
    await bouncer.with(DeckPolicy).authorize('create')

    const payload = await request.validateUsing(createDeckValidator)

    const deck = await new ImportDeck().handle({
      owner: auth.getUserOrFail(),
      decklist: payload.decklist,
      name: payload.name || i18n.t('decks.defaultName'),
    })

    return response.redirect().toRoute('decks.show', { id: deck.id })
  }

  async destroy({ bouncer, params, response }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)
    await bouncer.with(DeckPolicy).authorize('delete', deck)

    await new DeleteDeck().handle({ deck })

    return response.redirect().toRoute('decks.index')
  }

  private userDecks(userId: number) {
    return Deck.query().where('user_id', userId).orderBy('id', 'asc')
  }
}
