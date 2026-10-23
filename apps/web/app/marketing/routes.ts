import router from '@adonisjs/core/services/router'

import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'

const { Marketing } = controllers.marketing

router.get('/', [Marketing, 'index']).use(middleware.guest()).as('home')
