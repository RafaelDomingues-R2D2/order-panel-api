import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { orders } from './orders'
import { organizations } from './organizations'

export const paymentMethodEnum = pgEnum('payment_method', [
  'CREDIT_CARD',
  'CREDIT_DEBIT',
  'PIX',
  'MONEY',
])
export const paymentStatusEnum = pgEnum('payment_status', [
  'PENDING',
  'COMPLETED',
  'FAILED',
])

export const payments = pgTable('payments', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  orderId: text('order_id')
    .references(() => orders.id)
    .notNull(),
  organizationId: text('organization_id')
    .references(() => organizations.id)
    .notNull(),
  amount: integer('amount'),
  method: paymentMethodEnum('method'),
  status: paymentStatusEnum('status').default('PENDING'),
  paidAt: timestamp('paid_at'),
})

export const paymentsRelations = relations(payments, ({ one }) => ({
  orders: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
    relationName: 'paymentsOrders',
  }),
  organizations: one(organizations, {
    fields: [payments.organizationId],
    references: [organizations.id],
    relationName: 'paymentsOrganizations',
  }),
}))
