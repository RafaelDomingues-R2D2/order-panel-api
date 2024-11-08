CREATE TYPE "public"."members_role" AS ENUM('ADMIN', 'MEMBER');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "members " (
	"id" text PRIMARY KEY NOT NULL,
	"role" "members_role" DEFAULT 'MEMBER',
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizations " (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(100),
	"description" text,
	"avatar_url" text,
	"owner_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "organizations _name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "token" RENAME TO "tokens";--> statement-breakpoint
ALTER TABLE "account" RENAME TO "accounts";--> statement-breakpoint
ALTER TABLE "accounts" DROP CONSTRAINT "account_provider_account_id_unique";--> statement-breakpoint
ALTER TABLE "tokens" DROP CONSTRAINT "token_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "accounts" DROP CONSTRAINT "account_user_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "members " ADD CONSTRAINT "members _user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organizations " ADD CONSTRAINT "organizations _owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_provider_account_id_unique" UNIQUE("provider_account_id");