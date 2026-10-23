import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'postgres',
  prettyPrintDebugQueries: app.inDev,
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
        // Supabase's cert is signed by its own CA, absent from Node's trust store; traffic is still encrypted.
        ssl: env.get('DB_SSL') ? { rejectUnauthorized: false } : false,
      },
      migrations: {
        naturalSort: true,
        paths: [
          'app/users/database/migrations',
          'app/notifications/database/migrations',
          'app/decks/database/migrations',
        ],
      },
      seeders: {
        paths: ['app/users/database/seeders'],
      },
      schemaGeneration: {
        outputPath: './app/core/database/schema.ts',
      },
      debug: app.inDev,
    },
  },
})

export default dbConfig
