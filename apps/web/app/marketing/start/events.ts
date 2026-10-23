import emitter from '@adonisjs/core/services/emitter'
import mail from '@adonisjs/mail/services/main'

import ContactMessageNotification from '#marketing/mails/contact_message_notification'

emitter.on('contact:received', async function (data) {
  await mail.send(new ContactMessageNotification(data.contact, data.subject))
})
