ALTER TABLE "order_items" ADD COLUMN "organization_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "organization_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "organization_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "organization_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "organization_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "customer_addresses" ADD COLUMN "organization_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "organization_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "members " ADD COLUMN "organization_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_organization_id_organizations _id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations "("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_organization_id_organizations _id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations "("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_organization_id_organizations _id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations "("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories" ADD CONSTRAINT "categories_organization_id_organizations _id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations "("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customers" ADD CONSTRAINT "customers_organization_id_organizations _id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations "("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_addresses" ADD CONSTRAINT "customer_addresses_organization_id_organizations _id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations "("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_organization_id_organizations _id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations "("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "members " ADD CONSTRAINT "members _organization_id_organizations _id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations "("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
