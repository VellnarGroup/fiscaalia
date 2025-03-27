import { FastifyReply, FastifyRequest } from 'fastify'
import {
  AssignRoleToUserBody,
  CreateUserBody,
  LoginBody,
} from './users.schemas'
import { SYSTEM_ROLES } from '../../config/permissions'
import { getRoleByName } from '../roles/roles.services'
import {
  assignRoleToUser,
  createUser,
  getUserByEmail,
  getUsersByDatabase,
} from './users.services'
import jwt from 'jsonwebtoken'
import { logger } from '../../utils/logger'

export const createUserHandler = async (
  request: FastifyRequest<{
    Body: CreateUserBody
  }>,
  reply: FastifyReply
) => {
  const { initialUser, ...data } = request.body

  const roleName = initialUser
    ? SYSTEM_ROLES.SUPER_ADMIN
    : SYSTEM_ROLES.DATABASE_USER

  if (roleName === SYSTEM_ROLES.SUPER_ADMIN) {
    const appUsers = await getUsersByDatabase(data.databaseId)

    if (appUsers.length > 0) {
      return reply.code(400).send({
        message: 'Database already has super admin user',
        extensions: {
          code: 'DATABASE_ALREADY_SUPER_USER',
          databaseId: data.databaseId,
        },
      })
    }
  }

  const role = await getRoleByName({
    name: roleName,
    databaseId: data.databaseId,
  })

  if (!role) {
    return reply.code(404).send({
      message: 'Role not found',
    })
  }

  try {
    const user = await createUser(data)

    await assignRoleToUser({
      userId: user.id,
      roleId: role.id,
      databaseId: data.databaseId,
    })

    return user
  } catch (e) {}
}

export const loginHandler = async (
  request: FastifyRequest<{
    Body: LoginBody
  }>,
  reply: FastifyReply
) => {
  const { databaseId, email, password } = request.body

  const user = await getUserByEmail({
    databaseId,
    email,
  })

  if (!user) {
    return reply.code(400).send({
      message: 'Invalid email or password',
    })
  }

  // rs256 TODO
  const token = jwt.sign(
    {
      id: user.id,
      email,
      databaseId,
      scopes: user.permissions,
    },
    'fiscaalia-777-secret'
  )

  return { token }
}

export const assignRoleToUserHandler = async (
  request: FastifyRequest<{
    Body: AssignRoleToUserBody
  }>,
  reply: FastifyReply
) => {
  if (!request.user) {
    return reply.code(401).send({
      message: 'Unauthorized: User not authenticated',
    })
  }

  const databaseId = request.user.databaseId

  const { userId, roleId } = request.body

  try {
    const result = await assignRoleToUser({
      userId,
      databaseId,
      roleId,
    })

    return result
  } catch (e) {
    logger.error(e, `error assigning role to user`)

    return reply.code(400).send({
      message: 'could not assign role to user',
    })
  }
}
