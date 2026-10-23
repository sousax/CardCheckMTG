import vine from '@vinejs/vine'

export const createContactMessageValidator = vine.create({
  'name': vine.string().trim().minLength(2).maxLength(100),
  'email': vine.string().trim().email().maxLength(254),
  'message': vine.string().trim().minLength(10).maxLength(5000),
  // Honeypot: hidden from people, filled in by naive bots.
  'website': vine.string().optional(),
  // Injected into the form by the Turnstile widget.
  'cf-turnstile-response': vine.string().optional(),
})
