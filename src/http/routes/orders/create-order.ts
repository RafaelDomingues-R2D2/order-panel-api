import { and, eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { db } from "@/db/connection";
import { customerAddresses, orderStages, orders, payments } from "@/db/schema";
import { auth } from "@/http/middlewares/auth";

export async function createOrder(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.post(
			"/orders",
			{
				schema: {
					body: z.object({
						customerId: z.string(),
						deliveryDate: z.string(),
						pickupeByCustomer: z.boolean(),
					}),
				},
			},
			async (request, reply) => {
				const { customerId, deliveryDate, pickupeByCustomer } = request.body;

				const organizationId = await request.getCurrentOrganizationIdOfUser();

				const orderStage = await db
					.select()
					.from(orderStages)
					.where(
						and(
							eq(orderStages.name, "TODO"),
							eq(orderStages.organizationId, organizationId),
						),
					);

				const customerAddress = await db
					.select()
					.from(customerAddresses)
					.where(
						and(
							eq(customerAddresses.organizationId, organizationId),
							eq(customerAddresses.customerId, customerId),
						),
					);

				const order = await db
					.insert(orders)
					.values({
						customerId,
						shippingAddressId: customerAddress[0].id,
						priority: "NORMAL",
						orderStageId: orderStage[0].id,
						deliveryDate,
						pickupeByCustomer,
						organizationId,
					})
					.returning();

				await db.insert(payments).values({
					orderId: order[0].id,
					method: "CREDIT_CARD",
					status: "PENDING",
					organizationId,
				});

				return reply.status(201).send({
					order: order[0],
				});
			},
		);
}
