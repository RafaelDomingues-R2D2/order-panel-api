import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { db } from "@/db/connection";
import { products } from "@/db/schema";
import { auth } from "@/http/middlewares/auth";
import { and, eq } from "drizzle-orm";

export async function StockEntry(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.patch(
			"/products/stock-entry/:id",
			{
				schema: {
					params: z.object({
						id: z.string(),
					}),
					body: z.object({
						stock: z.number(),
					}),
				},
			},
			async (request, reply) => {
				const { id } = request.params;
				const { stock } = request.body;

				const organizationId = await request.getCurrentOrganizationIdOfUser();

				const productData = await db
					.select()
					.from(products)
					.where(
						and(
							eq(products.organizationId, organizationId),
							eq(products.id, id),
						),
					);

				const product = await db
					.update(products)
					.set({
						stock: Number(productData[0]?.stock) + stock,
					})
					.where(
						and(
							eq(products.organizationId, organizationId),
							eq(products.id, id),
						),
					)
					.returning();

				return reply.status(200).send({
					product,
				});
			},
		);
}
