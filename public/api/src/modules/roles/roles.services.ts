import { InferInsertModel, and, eq } from 'drizzle-orm'
import { db } from '../../db'
import { roles } from '../../db/schema'

export const createRole = async (data: InferInsertModel<typeof roles>) => {
  const result = await db.insert(roles).values(data).returning()

  return result[0]
}

export const getRoleByName = async ({
  name,
  databaseId,
}: {
  name: string
  databaseId: string
}) => {
  const result = await db
    .select()
    .from(roles)
    .where(and(eq(roles.name, name), eq(roles.databaseId, databaseId)))
    .limit(1)

  return result[0]
}
