import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { users } from './users'

export const tokenType = pgEnum('token_type', ['PASSWORD_RECOVER'])

export const token = pgTable('token', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  type: tokenType('type').notNull(),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),

  createdAt: timestamp('created_at').defaultNow(),
})

export const tokenRelations = relations(token, ({ one }) => ({
  users: one(users, {
    fields: [token.userId],
    references: [users.id],
    relationName: 'tokenUser',
  }),
}))
