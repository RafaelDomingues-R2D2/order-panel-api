import { and, eq, sum } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { db } from "@/db/connection";
import { orderItems, orders } from "@/db/schema";
import { auth } from "@/http/middlewares/auth";

interface Params {
	id: string;
}

export async function deleteOrderItem(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.delete<{ Params: Params }>(
			"/order-items/:id",
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

				const orderItemExisted = await db
					.select({ orderId: orderItems.orderId })
					.from(orderItems)
					.where(
						and(
							eq(orderItems.organizationId, organizationId),
							eq(orderItems.id, id),
						),
					);

				await db
					.delete(orderItems)
					.where(
						and(
							eq(orderItems.organizationId, organizationId),
							eq(orderItems.id, id),
						),
					);

				const total = await db
					.select({ total: sum(orderItems.total) })
					.from(orderItems)
					.where(
						and(
							eq(orderItems.organizationId, organizationId),
							eq(orderItems.orderId, orderItemExisted[0].orderId),
						),
					);

				await db
					.update(orders)
					.set({ total: Number(total[0].total) })
					.where(
						and(
							eq(orders.organizationId, organizationId),
							eq(orders.id, orderItemExisted[0].orderId),
						),
					);

				return reply.status(200).send({});
			},
		);
}
