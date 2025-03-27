import { InferInsertModel } from 'drizzle-orm'
import { db } from '../../db'
import { databases } from '../../db/schema'

export const createDatabase = async (
  data: InferInsertModel<typeof databases>
) => {
  const result = await db.insert(databases).values(data).returning()

  return result[0]
}

export const getDatabases = async () => {
  const result = await db
    .select({
      id: databases.id,
      name: databases.name,
      createdAt: databases.createdAt,
    })
    .from(databases)

  return result
}
