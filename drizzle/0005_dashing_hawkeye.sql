ALTER TABLE "orders" ADD COLUMN "order_stage_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_order_stage_id_orders_id_fk" FOREIGN KEY ("order_stage_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "status";--> statement-breakpoint
DROP TYPE "public"."order_status";
