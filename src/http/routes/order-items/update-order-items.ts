import { and, eq, sum } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { db } from "@/db/connection";
import { orderItems, orders, products } from "@/db/schema";
import { auth } from "@/http/middlewares/auth";

interface Params {
	id: string;
}
interface Body {
	productId: string;
	quantity: number;
}

export async function updateOrderItem(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.put<{ Params: Params; Body: Body }>(
			"/order-items/:id",
			{
				schema: {
					params: z.object({
						id: z.string(),
					}),
					body: z.object({
						productId: z.string().optional(),
						quantity: z.number().optional(),
					}),
				},
			},
			async (request, reply) => {
				const { id } = request.params;

				const { quantity, productId } = request.body;

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

				const product = await db
					.select()
					.from(products)
					.where(eq(products.id, productId));

				const orderItem = await db
					.update(orderItems)
					.set({
						productId,
						quantity,
						total: Number(quantity) * Number(product[0]?.price),
					})
					.where(
						and(
							eq(orderItems.organizationId, organizationId),
							eq(orderItems.id, id),
						),
					)
					.returning();

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

				return reply.status(200).send({
					order: orderItem,
				});
			},
		);
}
