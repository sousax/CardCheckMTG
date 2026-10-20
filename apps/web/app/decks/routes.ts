import router from '@adonisjs/core/services/router'

import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'

const { Decks, DeckCards } = controllers.decks

router
  .get('/', async ({ auth, response }) => {
    const signedIn = await auth.check()
    return response.redirect().toRoute(signedIn ? 'decks.index' : 'auth.sign_in.show')
  })
  .as('home')

router
  .resource('/decks', Decks)
  .only(['index', 'show', 'store', 'destroy'])
  .where('id', router.matchers.number())
  .use('*', middleware.auth())
  .as('decks')

router
  .patch('/decks/:deck_id/cards/:id', [DeckCards, 'update'])
  .where('deck_id', router.matchers.number())
  .where('id', router.matchers.number())
  .middleware(middleware.auth())
  .as('decks.cards.update')
