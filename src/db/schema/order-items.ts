import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { orders } from "./orders";
import { organizations } from "./organizations";
import { products } from "./products";

export const orderItems = pgTable("order_items", {
	id: text("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	orderId: text("order_id")
		.references(() => orders.id)
		.notNull(),
	productId: text("product_id")
		.references(() => products.id)
		.notNull(),
	organizationId: text("organization_id")
		.references(() => organizations.id)
		.notNull(),
	quantity: integer("quantity").default(1),
	total: integer("price"),

	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id],
		relationName: "orderItemsOrders",
	}),
	products: one(products, {
		fields: [orderItems.productId],
		references: [products.id],
		relationName: "orderItemsProducts",
	}),
	organizations: one(organizations, {
		fields: [orderItems.organizationId],
		references: [organizations.id],
		relationName: "orderItemsOrganizations",
	}),
}));
