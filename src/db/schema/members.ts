import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { organizations } from './organizations'
import { users } from './users'

export const membersRoleEnum = pgEnum('members_role', ['ADMIN', 'MEMBER'])

export const members = pgTable('members ', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  role: membersRoleEnum('role').default('MEMBER'),

  userId: text('user_id')
    .references(() => users.id)
    .notNull(),

  organizationId: text('organization_id')
    .references(() => organizations.id)
    .notNull(),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const membersRelations = relations(members, ({ one }) => ({
  users: one(users, {
    fields: [members.userId],
    references: [users.id],
    relationName: 'membersUsers',
  }),
  organizations: one(organizations, {
    fields: [members.organizationId],
    references: [organizations.id],
    relationName: 'membersOrganizations',
  }),
}))
