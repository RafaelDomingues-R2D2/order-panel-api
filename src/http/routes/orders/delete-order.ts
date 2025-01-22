import { and, eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { db } from "@/db/connection";
import { orderItems, orders, payments } from "@/db/schema";
import { auth } from "@/http/middlewares/auth";

interface Params {
	id: string;
}

export async function deleteOrder(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.delete<{ Params: Params }>(
			"/orders/:id",
			{
				schema: {
					params: z.object({
						id: z.string(),
					}),
				},
			},
			async (request, reply) => {
				const { id } = request.params;

				const organizationId = await request.getCurrentOrganizationIdOfUser();

				await db
					.delete(orderItems)
					.where(
						and(
							eq(orderItems.organizationId, organizationId),
							eq(orderItems.orderId, id),
						),
					);

				await db
					.delete(payments)
					.where(
						and(
							eq(payments.organizationId, organizationId),
							eq(payments.orderId, id),
						),
					);

				await db
					.delete(orders)
					.where(
						and(eq(orders.organizationId, organizationId), eq(orders.id, id)),
					);

				return reply.status(200).send({});
			},
		);
}
