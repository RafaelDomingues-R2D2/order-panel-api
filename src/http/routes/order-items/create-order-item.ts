import { and, eq, sum } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { db } from "@/db/connection";
import { orderItems, orders, products } from "@/db/schema";
import { auth } from "@/http/middlewares/auth";

export async function createOrderItem(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.post(
			"/order-items",
			{
				schema: {
					body: z.object({
						orderId: z.string(),
						productId: z.string(),
						quantity: z.number(),
					}),
				},
			},
			async (request, reply) => {
				const { orderId, productId, quantity } = request.body;

				const organizationId = await request.getCurrentOrganizationIdOfUser();

				const product = await db
					.select()
					.from(products)
					.where(eq(products.id, productId));

				const orderItem = await db
					.insert(orderItems)
					.values({
						orderId,
						productId,
						quantity: quantity,
						total: Number(quantity) * Number(product[0]?.price),
						organizationId,
					})
					.returning();

				const total = await db
					.select({ total: sum(orderItems.total) })
					.from(orderItems)
					.where(
						and(
							eq(orderItems.organizationId, organizationId),
							eq(orderItems.orderId, orderId),
						),
					);

				await db
					.update(orders)
					.set({ total: Number(total[0].total) })
					.where(
						and(
							eq(orders.organizationId, organizationId),
							eq(orders.id, orderId),
						),
					);

				return reply.status(201).send({
					orderItem,
				});
			},
		);
}
