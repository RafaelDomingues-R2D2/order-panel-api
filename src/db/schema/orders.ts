import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { customerAddresses } from './customer-addresses'
import { customers } from './customers'
import { orderStages } from './order-stages'
import { orderItems } from './orders-items'
import { organizations } from './organizations'

export const priorityEnum = pgEnum('order_PRIORITY', [
  'URGENT',
  'HIGH',
  'NORMAL',
  'LOW',
])

export const orders = pgTable('orders', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  customerId: text('customer_id')
    .references(() => customers.id)
    .notNull(),
  shippingAddressId: text('shipping_address_id')
    .references(() => customerAddresses.id)
    .notNull(),
  organizationId: text('organization_id')
    .references(() => organizations.id)
    .notNull(),
  orderStageId: text('order_stage_id')
    .references(() => orderStages.id)
    .notNull(),
  totalAmount: integer('total_amount'),
  totalItems: integer('total_items').default(0),
  priority: priorityEnum('priority').default('NORMAL'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customers: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
    relationName: 'ordersCustomers',
  }),
  shippingAddresses: one(customerAddresses, {
    fields: [orders.shippingAddressId],
    references: [customerAddresses.id],
    relationName: 'ordersShippingAddresses',
  }),
  organizations: one(organizations, {
    fields: [orders.organizationId],
    references: [organizations.id],
    relationName: 'ordersOrganizations',
  }),
  stages: one(orderStages, {
    fields: [orders.orderStageId],
    references: [orderStages.id],
    relationName: 'ordersOrderStages',
  }),
  orderItems: many(orderItems),
}))
