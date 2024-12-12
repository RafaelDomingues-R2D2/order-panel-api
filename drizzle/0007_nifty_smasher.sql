ALTER TABLE "orderStages" RENAME TO "order_stages";--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_order_stage_id_orderStages_id_fk";
--> statement-breakpoint
ALTER TABLE "order_stages" DROP CONSTRAINT "orderStages_organization_id_organizations _id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_order_stage_id_order_stages_id_fk" FOREIGN KEY ("order_stage_id") REFERENCES "public"."order_stages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_stages" ADD CONSTRAINT "order_stages_organization_id_organizations _id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations "("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
