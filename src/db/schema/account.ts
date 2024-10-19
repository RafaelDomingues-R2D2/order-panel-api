import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, text } from 'drizzle-orm/pg-core'

import { users } from '.'

export const accountProvider = pgEnum('account_provider', ['GITHUB'])

export const account = pgTable('account', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  provider: accountProvider('type').notNull(),
  providerAccountId: text('provider_account_id').notNull().unique(),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),
})

export const accountRelations = relations(account, ({ one }) => ({
  users: one(users, {
    fields: [account.userId],
    references: [users.id],
    relationName: 'accountUser',
  }),
}))
