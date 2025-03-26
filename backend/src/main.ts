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
    port: 3000,
  })

  const signals = ['SIGINT', 'SIGTERM']

  for (const signal of signals) {
    process.on(signal, () => {
      gracefulShutdown({ app })
    })
  }
}

main()
