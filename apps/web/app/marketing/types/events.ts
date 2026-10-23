// Module augmentation, not a replacement: the file must be a module.
export {}

declare module '@adonisjs/core/types' {
  interface EventsList {
    'contact:received': {
      contact: { name: string; email: string; message: string }
      subject: string
    }
  }
}
