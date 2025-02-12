import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
	boolean,
	date,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

import { customerAddresses } from "./customer-addresses";
import { customers } from "./customers";
import { orderItems } from "./order-items";
import { orderStages } from "./order-stages";
import { organizations } from "./organizations";

export const priorityEnum = pgEnum("order_PRIORITY", [
	"URGENT",
	"HIGH",
	"NORMAL",
	"LOW",
]);

export const orders = pgTable("orders", {
	id: text("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	customerId: text("customer_id")
		.references(() => customers.id)
		.notNull(),
	shippingAddressId: text("shipping_address_id")
		.references(() => customerAddresses.id)
		.notNull(),
	organizationId: text("organization_id")
		.references(() => organizations.id)
		.notNull(),
	orderStageId: text("order_stage_id")
		.references(() => orderStages.id)
		.notNull(),
	priority: priorityEnum("priority").default("NORMAL"),
	deliveryDate: date("delivery_date"),
	total: integer("price"),
	pickupeByCustomer: boolean("pickupe_by_customer").default(false),

	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
	customers: one(customers, {
		fields: [orders.customerId],
		references: [customers.id],
		relationName: "ordersCustomers",
	}),
	shippingAddresses: one(customerAddresses, {
		fields: [orders.shippingAddressId],
		references: [customerAddresses.id],
		relationName: "ordersShippingAddresses",
	}),
	organizations: one(organizations, {
		fields: [orders.organizationId],
		references: [organizations.id],
		relationName: "ordersOrganizations",
	}),
	stages: one(orderStages, {
		fields: [orders.orderStageId],
		references: [orderStages.id],
		relationName: "ordersOrderStages",
	}),
	orderItems: many(orderItems),
}));
