import { BasePolicy } from '@adonisjs/bouncer'
import { type AuthorizerResponse } from '@adonisjs/bouncer/types'

import type User from '#users/models/user'

import type Deck from '#decks/models/deck'

// Decks are private: any signed-in user manages their own, nobody else's.
export default class DeckPolicy extends BasePolicy {
  async viewList(_user: User): Promise<AuthorizerResponse> {
    return true
  }

  async create(_user: User): Promise<AuthorizerResponse> {
    return true
  }

  async view(user: User, deck: Deck): Promise<AuthorizerResponse> {
    return deck.userId === user.id
  }

  async update(user: User, deck: Deck): Promise<AuthorizerResponse> {
    return deck.userId === user.id
  }

  async delete(user: User, deck: Deck): Promise<AuthorizerResponse> {
    return deck.userId === user.id
  }
}
