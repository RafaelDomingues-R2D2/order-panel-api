import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, text, varchar } from 'drizzle-orm/pg-core'

import { customers } from './customers'
import { organizations } from './organizations'

export const addressTypeEnum = pgEnum('address_type', ['BILLING', 'SHIPPING'])

export const customerAddresses = pgTable('customer_addresses', {
	id: text('id')
		.$defaultFn(() => createId())
		.primaryKey(),
	customerId: text('customer_id')
		.references(() => customers.id)
		.notNull(),
	organizationId: text('organization_id')
		.references(() => organizations.id)
		.notNull(),
	addressType: addressTypeEnum('address_type'),
	street: text('street'),
	neighborhood: varchar('neighborhood', { length: 100 }),
	city: varchar('city', { length: 100 }),
	state: varchar('state', { length: 100 }),
	postalCode: varchar('postal_code', { length: 20 }),
})

export const customerAddressesRelations = relations(
	customerAddresses,
	({ one }) => ({
		customers: one(customerAddresses, {
			fields: [customerAddresses.customerId],
			references: [customerAddresses.id],
			relationName: 'customerAddressesCustomers',
		}),
		organizations: one(organizations, {
			fields: [customerAddresses.organizationId],
			references: [organizations.id],
			relationName: 'customerAddressesOrganizations',
		}),
	}),
)
