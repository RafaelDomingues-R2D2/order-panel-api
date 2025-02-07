import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { db } from "@/db/connection";
import { products } from "@/db/schema";
import { auth } from "@/http/middlewares/auth";
import { and, eq } from "drizzle-orm";

export async function updateProduct(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.put(
			"/products/:id",
			{
				schema: {
					params: z.object({
						id: z.string(),
					}),
					body: z.object({
						name: z.string(),
						description: z.string().optional(),
						price: z.number(),
						stock: z.number(),
						categoryId: z.string(),
					}),
				},
			},
			async (request, reply) => {
				const { id } = request.params;
				const { name, description, price, stock, categoryId } = request.body;

				const organizationId = await request.getCurrentOrganizationIdOfUser();

				const product = await db
					.update(products)
					.set({
						name,
						description,
						price,
						stock,
						categoryId,
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
