import { FastifyReply, FastifyRequest } from 'fastify'
import { CreateDatabaseBody } from './databases.schemas'
import { createDatabase, getDatabases } from './databases.services'
import { createRole } from '../roles/roles.services'
import {
  ALL_PERMISSIONS,
  SYSTEM_ROLES,
  USER_ROLE_PERMISSIONS,
} from '../../config/permissions'

export const createDatabaseHandler = async (
  request: FastifyRequest<{
    Body: CreateDatabaseBody
  }>,
  reply: FastifyReply
) => {
  const { name } = request.body

  const database = await createDatabase({
    name,
  })

  const superAdminRolePromise = createRole({
    databaseId: database.id,
    name: SYSTEM_ROLES.SUPER_ADMIN,
    permissions: ALL_PERMISSIONS as unknown as Array<string>,
  })

  const databaseUserRolePromise = createRole({
    databaseId: database.id,
    name: SYSTEM_ROLES.DATABASE_USER,
    permissions: USER_ROLE_PERMISSIONS,
  })

  const [superAdminRole, databaseUserRole] = await Promise.allSettled([
    superAdminRolePromise,
    databaseUserRolePromise,
  ])

  if (superAdminRole.status === 'rejected') {
    throw new Error('Error creating super admin role')
  }

  if (databaseUserRole.status === 'rejected') {
    throw new Error('Error creating database user role')
  }

  return {
    database,
    superAdminRole: superAdminRole.value,
    databaseUserRole: databaseUserRole.value,
  }
}

export const getDatabasesHandler = async () => {
  return getDatabases()
}
