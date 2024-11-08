CREATE TYPE "public"."order_PRIORITY" AS ENUM('URGENT', 'HIGH', 'NORMAL', 'LOW');--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "amount" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "priority" "order_PRIORITY" DEFAULT 'NORMAL';--> statement-breakpoint
ALTER TABLE "public"."payments" ALTER COLUMN "method" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."payment_method";--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('CREDIT_CARD', 'CREDIT_DEBIT', 'PIX', 'MONEY');--> statement-breakpoint
ALTER TABLE "public"."payments" ALTER COLUMN "method" SET DATA TYPE "public"."payment_method" USING "method"::"public"."payment_method";