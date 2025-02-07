import { and, eq, sum } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { db } from "@/db/connection";
import { categories, orderItems, orders, products } from "@/db/schema";
import { auth } from "@/http/middlewares/auth";

interface Params {
	id: string;
}

export async function deleteCategory(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.delete<{ Params: Params }>(
			"/categories/:id",
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

				const productExisted = await db.select().from(products).where(and(eq(products.organizationId, organizationId), eq(products.categoryId, id)))

				if(productExisted.length > 0){
					throw new Error("Esta categoria não pode ser deleta, pois possui um produto")
				}

				await db
					.delete(categories)
					.where(
						and(
							eq(categories.organizationId, organizationId),
							eq(categories.id, id),
						),
					);


				return reply.status(200).send({});
			},
		);
}
