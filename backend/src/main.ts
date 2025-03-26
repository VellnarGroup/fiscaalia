import { buildServer } from './utils/server'

const main = async () => {
  const app = await buildServer()

  app.listen({
    port: 3000,
  })
}

main()
