import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { organizations } from "./organizations";

export const orderStages = pgTable("order_stages", {
	id: text("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	organizationId: text("organization_id")
		.references(() => organizations.id)
		.notNull(),
	name: text("name"),

	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orderStagesRelations = relations(orderStages, ({ one }) => ({
	organizations: one(organizations, {
		fields: [orderStages.organizationId],
		references: [organizations.id],
		relationName: "orderStagesOrganizations",
	}),
}));
