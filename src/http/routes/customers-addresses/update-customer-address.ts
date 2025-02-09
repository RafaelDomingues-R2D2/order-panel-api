import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { db } from "@/db/connection";
import { customerAddresses } from "@/db/schema";
import { auth } from "@/http/middlewares/auth";
import { and, eq } from "drizzle-orm";

export async function updateCustomerAddress(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.put(
			"/customers-addresses/:id",
			{
				schema: {
					params: z.object({
						id: z.string(),
					}),
					body: z.object({
						customerId: z.string(),
						street: z.string(),
						number: z.string(),
						neighborhood: z.string(),
						city: z.string(),
						state: z.string(),
						postalCode: z.string(),
					}),
				},
			},
			async (request, reply) => {
				const { id } = request.params;

				const {
					customerId,
					street,
					number,
					neighborhood,
					city,
					state,
					postalCode,
				} = request.body;

				const organizationId = await request.getCurrentOrganizationIdOfUser();

				const customerAddresse = await db
					.update(customerAddresses)
					.set({
						customerId,
						addressType: "SHIPPING",
						street,
						number,
						neighborhood,
						city,
						state,
						postalCode,
						organizationId,
					})
					.where(
						and(
							eq(customerAddresses.organizationId, organizationId),
							eq(customerAddresses.id, id),
						),
					)
					.returning();

				return reply.status(200).send({
					customerAddresse,
				});
			},
		);
}
