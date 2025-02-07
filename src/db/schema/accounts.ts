import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { users } from ".";

export const accountProvider = pgEnum("account_provider", ["GITHUB"]);

export const accounts = pgTable("accounts", {
	id: text("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	provider: accountProvider("type").notNull(),
	providerAccountId: text("provider_account_id").notNull().unique(),
	userId: text("user_id")
		.references(() => users.id)
		.notNull(),

	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const accountRelations = relations(accounts, ({ one }) => ({
	users: one(users, {
		fields: [accounts.userId],
		references: [users.id],
		relationName: "accountUser",
	}),
}));
