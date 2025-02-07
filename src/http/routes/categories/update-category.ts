import { and, eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { db } from "@/db/connection";
import { categories, orders } from "@/db/schema";
import { auth } from "@/http/middlewares/auth";

interface Params {
	id: string;
}
interface Body {
	name: string;
	description: string;
}

export async function updateCategory(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.put<{ Params: Params; Body: Body }>(
			"/categories/:id",
			{
				schema: {
					params: z.object({
						id: z.string(),
					}),
					body: z.object({
						name: z.string(),
						description: z.string().optional(),
					}),
				},
			},
			async (request, reply) => {
				const { id } = request.params;

				const { name, description } = request.body;

				const organizationId = await request.getCurrentOrganizationIdOfUser();

				const order = await db
					.update(categories)
					.set({
						name, description
					})
					.where(
						and(eq(categories.organizationId, organizationId), eq(categories.id, id)),
					)
					.returning();

				return reply.status(200).send({
					order: order,
				});
			},
		);
}
