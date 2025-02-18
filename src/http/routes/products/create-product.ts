import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { db } from "@/db/connection";
import { products } from "@/db/schema";
import { auth } from "@/http/middlewares/auth";

export async function createProduct(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.post(
			"/products",
			{
				schema: {
					body: z.object({
						name: z.string(),
						description: z.string().optional(),
						price: z.number(),
						categoryId: z.string(),
					}),
				},
			},
			async (request, reply) => {
				const { name, description, price, categoryId } = request.body;

				const organizationId = await request.getCurrentOrganizationIdOfUser();

				const product = await db
					.insert(products)
					.values({
						name,
						description,
						price,
						categoryId,
						organizationId,
					})
					.returning();

				return reply.status(201).send({
					product,
				});
			},
		);
}
