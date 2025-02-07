import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { db } from "@/db/connection";
import { customers } from "@/db/schema";
import { auth } from "@/http/middlewares/auth";
import { and, eq } from "drizzle-orm";

export async function updateCustomer(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.put(
			"/customers/:id",
			{
				schema: {
					params: z.object({
						id: z.string(),
					}),
					body: z.object({
						name: z.string(),
						email: z.string().optional(),
						phone: z.string(),
					}),
				},
			},
			async (request, reply) => {
				const { id } = request.params;

				const { name, email, phone } = request.body;

				const organizationId = await request.getCurrentOrganizationIdOfUser();

				const customer = await db
					.update(customers)
					.set({
						name,
						email,
						phone,
					})
					.where(
						and(
							eq(customers.organizationId, organizationId),
							eq(customers.id, id),
						),
					)
					.returning();

				return reply.status(200).send({
					customer,
				});
			},
		);
}
