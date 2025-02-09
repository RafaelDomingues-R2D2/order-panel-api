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
					.select({
						orderId: orderItems.orderId,
						quantity: orderItems.quantity,
						productId: orderItems.productId,
					})
					.from(orderItems)
					.innerJoin(products, eq(products.id, orderItems.productId))
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

				const product = await db
					.select()
					.from(products)
					.where(
						and(
							eq(products.organizationId, organizationId),
							eq(products.id, orderItemExisted[0].productId),
						),
					);

				await db
					.update(products)
					.set({
						stock:
							Number(product[0].stock) + Number(orderItemExisted[0].quantity),
					})
					.where(
						and(
							eq(products.organizationId, organizationId),
							eq(products.id, orderItemExisted[0].productId),
						),
					);

				return reply.status(200).send({});
			},
		);
}
