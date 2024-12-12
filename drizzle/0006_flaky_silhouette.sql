CREATE TABLE IF NOT EXISTS "orderStages" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"stage" text
);
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_order_stage_id_orders_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderStages" ADD CONSTRAINT "orderStages_organization_id_organizations _id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations "("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_order_stage_id_orderStages_id_fk" FOREIGN KEY ("order_stage_id") REFERENCES "public"."orderStages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
