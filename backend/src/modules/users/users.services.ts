import { InferInsertModel, and, eq } from 'drizzle-orm'
import argon2 from 'argon2'
import { databases, roles, users } from '../../db/schema'
import { db } from '../../db'
import { usersToRoles } from '../../db/schema'

export const createUser = async (data: InferInsertModel<typeof users>) => {
  const hashedPassword = await argon2.hash(data.password)

  const result = await db
    .insert(users)
    .values({
      ...data,
      password: hashedPassword,
    })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      databaseId: databases.id,
    })

  return result[0]
}

export const getUsersByDatabase = async (databaseId: string) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.databaseId, databaseId))

  return result
}

export const assignRoleToUser = async (
  data: InferInsertModel<typeof usersToRoles>
) => {
  const result = await db.insert(usersToRoles).values(data).returning()

  return result[0]
}

export const getUserByEmail = async ({
  email,
  databaseId,
}: {
  email: string
  databaseId: string
}) => {
  const result = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      databaseId: users.databaseId,
      roleId: roles.id,
      password: users.password,
      permissions: roles.permissions,
    })
    .from(users)
    .where(and(eq(users.email, email), eq(users.databaseId, databaseId)))
    .leftJoin(
      usersToRoles,
      and(
        eq(usersToRoles.userId, users.id),
        eq(usersToRoles.databaseId, users.databaseId)
      )
    )
    .leftJoin(roles, eq(roles.id, usersToRoles.roleId))

  if (!result.length) {
    return null
  }

  const user = result.reduce((acc, curr) => {
    if (!acc.id) {
      return {
        ...curr,
        permissions: new Set(curr.permissions),
      }
    }

    if (!curr.permissions) {
      return acc
    }

    for (const permission of curr.permissions) {
      acc.permissions.add(permission)
    }

    return acc
  }, {} as Omit<(typeof result)[number], 'permissions'> & { permissions: Set<string> })

  return {
    ...user,
    permissions: Array.from(user.permissions),
  }
}
