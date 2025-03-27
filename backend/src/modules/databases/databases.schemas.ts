import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

const createDatabaseBodySchema = z.object({
  name: z.string({
    required_error: 'Name is required',
  }),
})

export type CreateDatabaseBody = z.infer<typeof createDatabaseBodySchema>

export const createDatabaseJsonSchema = {
  body: zodToJsonSchema(createDatabaseBodySchema, 'createDatabaseBodySchema'),
}
