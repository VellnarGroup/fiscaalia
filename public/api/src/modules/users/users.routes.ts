import { FastifyInstance } from 'fastify'
import {
  assignRoleToUserHandler,
  createUserHandler,
  loginHandler,
} from './users.controllers'
import {
  AssignRoleToUserBody,
  assignRoleToUserJsonSchema,
  createUserJsonSchema,
  loginJsonSchema,
} from './users.schemas'
import { PERMISSIONS } from '../../config/permissions'

export const usersRoutes = async (app: FastifyInstance) => {
  app.post(
    '/',
    {
      schema: createUserJsonSchema,
    },
    createUserHandler
  )

  app.post(
    '/login',
    {
      schema: loginJsonSchema,
    },
    loginHandler
  )

  app.post<{
    Body: AssignRoleToUserBody
  }>(
    '/roles',
    {
      schema: assignRoleToUserJsonSchema,
      preHandler: [app.guard.scope(PERMISSIONS['users:roles:write'])],
    },
    assignRoleToUserHandler
  )

  app.get('/test', async (request, reply) => {
    const testUsers = [
      { id: 1, name: 'Mario Rossi', email: 'mario@example.com', role: 'user' },
      {
        id: 2,
        name: 'Giulia Bianchi',
        email: 'giulia@example.com',
        role: 'admin',
      },
      { id: 3, name: 'Paolo Verdi', email: 'paolo@example.com', role: 'user' },
      { id: 4, name: 'Anna Neri', email: 'anna@example.com', role: 'user' },
      {
        id: 5,
        name: 'Luca Gialli',
        email: 'luca@example.com',
        role: 'manager',
      },
    ]

    return {
      example: 'Test API funziona!',
      users: testUsers,
    }
  })
}
