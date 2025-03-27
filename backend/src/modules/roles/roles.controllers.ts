import { FastifyReply, FastifyRequest } from 'fastify'
import { CreateRoleBody } from './roles.schemas'
import { createRole } from './roles.services'

export const createRoleHandler = async (
  request: FastifyRequest<{
    Body: CreateRoleBody
  }>,
  reply: FastifyReply
) => {
  if (!request.user) {
    return reply.code(401).send({
      message: 'Unauthorized: User not authenticated',
    })
  }

  const user = request.user

  const databaseId = user.databaseId

  const { name, permissions } = request.body

  const role = await createRole({
    name,
    permissions,
    databaseId,
  })

  return role
}
