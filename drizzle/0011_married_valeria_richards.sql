ALTER TABLE "tokens" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "price" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "order_stages" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "order_stages" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "customer_addresses" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "customer_addresses" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "order_items" DROP COLUMN IF EXISTS "created_at";