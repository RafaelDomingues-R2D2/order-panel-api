import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { members } from "./members";
import { users } from "./users";

export const organizations = pgTable("organizations ", {
	id: text("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	name: varchar("name", { length: 100 }),
	description: text("description"),
	avatarUrl: text("avatar_url"),
	ownerId: text("owner_id")
		.references(() => users.id)
		.notNull(),

	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const organizationsRelations = relations(
	organizations,
	({ one, many }) => ({
		users: one(users, {
			fields: [organizations.ownerId],
			references: [users.id],
			relationName: "organizationUsers",
		}),
		members: many(members),
	}),
);
