import {
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const databases = pgTable('databases', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().notNull(),
    email: varchar('email', { length: 256 }).notNull(),
    name: varchar('name', { length: 256 }).notNull(),
    databaseId: uuid('databaseId').references(() => databases.id),
    password: varchar('password', { length: 256 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (users) => [
    primaryKey({ columns: [users.email, users.databaseId] }),
    uniqueIndex('users_id_index').on(users.id),
  ]
)

export const roles = pgTable(
  'roles',
  {
    id: uuid('id').defaultRandom().notNull(),
    name: varchar('name', { length: 256 }).notNull(),
    databaseId: uuid('databaseId').references(() => databases.id),
    permissions: text('permissions').array().$type<Array<string>>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (roles) => [
    primaryKey({ columns: [roles.name, roles.databaseId] }),
    uniqueIndex('roles_id_index').on(roles.id),
  ]
)

export const usersToRoles = pgTable(
  'usersToRoles',
  {
    databaseId: uuid('databaseId')
      .references(() => databases.id)
      .notNull(),

    roleId: uuid('roleId')
      .references(() => roles.id)
      .notNull(),

    userId: uuid('userId')
      .references(() => users.id)
      .notNull(),
  },
  (usersToRoles) => [
    primaryKey({
      columns: [
        usersToRoles.databaseId,
        usersToRoles.roleId,
        usersToRoles.userId,
      ],
    }),
  ]
)
