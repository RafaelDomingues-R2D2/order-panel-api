import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
	integer,
	pgTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

import { categories } from "./categories";
import { orderItems } from "./order-items";
import { organizations } from "./organizations";

export const products = pgTable("products", {
	id: text("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	categoryId: text("category_id")
		.references(() => categories.id)
		.notNull(),
	organizationId: text("organization_id")
		.references(() => organizations.id)
		.notNull(),
	name: varchar("name", { length: 100 }),
	description: text("description"),
	price: integer("price"),
	stock: integer("stock").default(0),

	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
	categories: one(categories, {
		fields: [products.categoryId],
		references: [categories.id],
		relationName: "productsCategories",
	}),
	organizations: one(organizations, {
		fields: [products.organizationId],
		references: [organizations.id],
		relationName: "productsOrganizations",
	}),
	orderItems: many(orderItems),
}));
