import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { accounts } from './accounts'
import { organizations } from './organizations'
import { tokens } from './tokens'

export const users = pgTable('users', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  avatarUrl: text('avatar_url'),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const usersRelations = relations(users, ({ many }) => ({
  tokens: many(tokens),
  accounts: many(accounts),
  organizations: many(organizations),
}))
