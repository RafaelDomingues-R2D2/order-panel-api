import { and, eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { db } from "@/db/connection";
import { orderItems, orders, products } from "@/db/schema";
import { auth } from "@/http/middlewares/auth";
import { z } from "zod";

export async function getOrderItems(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get(
			"/order-items",
			{
				schema: {
					querystring: z.object({
						orderId: z.string().optional(),
					}),
				},
			},
			async (request) => {
				const organizationId = await request.getCurrentOrganizationIdOfUser();

				const { orderId } = request.query;

				const result = await db
					.select({
						id: orderItems.id,
						orderId: orderItems.orderId,
						total: orderItems.total,
						quantity: orderItems.quantity,
						productName: products.name,
					})
					.from(orderItems)
					.innerJoin(products, eq(orderItems.productId, products.id))
					.where(
						and(
							eq(orderItems.organizationId, organizationId),
							orderId ? eq(orderItems?.orderId, orderId) : undefined,
						),
					);

				return { orderItems: result };
			},
		);
}
