import fastify from 'fastify'
import guard from 'fastify-guard'
import { databaseRoutes } from '../modules/databases/databases.routes'
import { usersRoutes } from '../modules/users/users.routes'
import { roleRoutes } from '../modules/roles/roles.routes'
import jwt from 'jsonwebtoken'

type User = {
  id: string
  databaseId: string
  scopes: Array<string>
}

declare module 'fastify' {
  interface FastifyRequest {
    user: User | null
  }
}

export const buildServer = async () => {
  const app = fastify({
    logger: {
      level: 'debug',
      transport: {
        target: 'pino-pretty',
      },
    },
  })

  app.decorateRequest('user', null)

  app.addHook('onRequest', async (request, reply) => {
    const authHeader = request.headers.authorization

    if (!authHeader) {
      return
    }

    try {
      const token = authHeader.replace('Bearer ', '')
      const decoded = jwt.verify(token, 'secret') as User

      console.log('user', decoded)

      request.user = decoded
    } catch (e) {}
  })

  // Fastify Plugins
  app.register(guard, {
    requestProperty: 'user',
    scopeProperty: 'scopes',
    errorHandler: (result, request, reply) => {
      return reply.send('you can not do that')
    },
  })

  // Fastify Routes
  app.register(databaseRoutes, { prefix: '/api/databases' })
  app.register(usersRoutes, { prefix: '/api/users' })
  app.register(roleRoutes, { prefix: '/api/roles' })

  return app
}
