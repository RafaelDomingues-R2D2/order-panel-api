import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { organizations } from "./organizations";

export const customers = pgTable("customers", {
	id: text("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	organizationId: text("organization_id")
		.references(() => organizations.id)
		.notNull(),
	name: varchar("first_name", { length: 100 }),
	email: varchar("email", { length: 255 }),
	phone: varchar("phone", { length: 20 }),

	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const organizationRelations = relations(customers, ({ one }) => ({
	organizations: one(organizations, {
		fields: [customers.organizationId],
		references: [organizations.id],
		relationName: "customersOrganizations",
	}),
}));
