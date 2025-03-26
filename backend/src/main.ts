import { env } from './config/env'
import { buildServer } from './utils/server'

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

  const signals = ['SIGINT', 'SIGTERM']

  for (const signal of signals) {
    process.on(signal, () => {
      gracefulShutdown({ app })
    })
  }
}

main()
