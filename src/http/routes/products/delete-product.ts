import { and, eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { db } from "@/db/connection";
import { customers, orderItems, orders, products } from "@/db/schema";
import { auth } from "@/http/middlewares/auth";

interface Params {
	id: string;
}

export async function deleteProduct(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.delete<{ Params: Params }>(
			"/products/:id",
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

				const orderItemsExisted = await db
					.select()
					.from(orderItems)
					.where(
						and(
							eq(orderItems.organizationId, organizationId),
							eq(orderItems.productId, id),
						),
					);

				if (orderItemsExisted.length > 0) {
					throw new Error(
						"Este produto não pode ser deleto, pois possui um pedido",
					);
				}

				await db
					.delete(products)
					.where(
						and(
							eq(products.organizationId, organizationId),
							eq(products.id, id),
						),
					);

				return reply.status(200).send({});
			},
		);
}
