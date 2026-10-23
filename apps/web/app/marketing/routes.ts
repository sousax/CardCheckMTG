import router from '@adonisjs/core/services/router'

import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'

const { ContactMessages, Marketing } = controllers.marketing

router.get('/', [Marketing, 'index']).use(middleware.guest()).as('home')
router.post('/contact', [ContactMessages, 'store']).as('contact.store')
