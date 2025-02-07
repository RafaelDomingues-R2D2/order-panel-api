import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { organizations } from "./organizations";

export const categories = pgTable("categories", {
	id: text("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	organizationId: text("organization_id")
		.references(() => organizations.id)
		.notNull(),
	name: varchar("name", { length: 100 }),
	description: text("description"),

	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const categoriesRelations = relations(categories, ({ one }) => ({
	organizations: one(organizations, {
		fields: [categories.organizationId],
		references: [organizations.id],
		relationName: "categoriesOrganizations",
	}),
}));
