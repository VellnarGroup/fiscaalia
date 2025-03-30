import fastify from 'fastify'
import guard from 'fastify-guard'
import { databaseRoutes } from '../modules/databases/databases.routes'
import { usersRoutes } from '../modules/users/users.routes'
import { roleRoutes } from '../modules/roles/roles.routes'
import jwt from 'jsonwebtoken'
import fastifyStatic from '@fastify/static'
import path from 'path'

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

      const decoded = jwt.verify(token, 'fiscaalia-777-secret') as User

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

  app.register(fastifyStatic, {
    root: path.join(__dirname, '../../../../dist'),
    prefix: '/',
    decorateReply: true, // Needed for the sendFile method
    wildcard: false, // Important for SPA routing
  })

  // Fastify Routes
  app.register(databaseRoutes, { prefix: '/api/databases' })
  app.register(usersRoutes, { prefix: '/api/users' })
  app.register(roleRoutes, { prefix: '/api/roles' })

  app.setNotFoundHandler((request, reply) => {
    // If the request is not for an API route, serve the index.html
    if (!request.url.startsWith('/api/')) {
      return reply.sendFile('index.html')
    }
    // Otherwise, return a 404 response
    reply.code(404).send({ error: 'Not found' })
  })

  return app
}
