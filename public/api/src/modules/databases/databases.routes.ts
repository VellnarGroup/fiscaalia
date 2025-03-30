import { FastifyInstance } from 'fastify'
import {
  createDatabaseHandler,
  getDatabasesHandler,
} from './databases.controllers'
import { createDatabaseJsonSchema } from './databases.schemas'

export const databaseRoutes = async (app: FastifyInstance) => {
  app.post('/', { schema: createDatabaseJsonSchema }, createDatabaseHandler)

  app.get('/', getDatabasesHandler)
}
