import { env } from './config/env'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { buildServer } from './utils/server'
import { db } from './db'

const gracefulShutdown = async ({
  app,
}: {
  app: Awaited<ReturnType<typeof buildServer>>
}) => {
  await app.close()
}

const main = async () => {
  const app = await buildServer()

  app.listen({
    port: env.PORT,
    host: env.HOST,
  })

  await migrate(db, {
    migrationsFolder: './migrations',
  })

  const signals = ['SIGINT', 'SIGTERM']

  for (const signal of signals) {
    process.on(signal, () => {
      gracefulShutdown({ app })
    })
  }
}

main()
