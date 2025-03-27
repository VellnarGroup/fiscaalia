import fastify from 'fastify'
import { logger } from './logger'
import { databaseRoutes } from '../modules/databases/databases.routes'

export const buildServer = async () => {
  const app = fastify({
    logger: logger,
  })

  // Fastify Plugins

  // Fastify Routes
  app.register(databaseRoutes, { prefix: '/api/databases' })

  return app
}
