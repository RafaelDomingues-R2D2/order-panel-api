import { and, eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { db } from "@/db/connection";
import { customers, orders } from "@/db/schema";
import { auth } from "@/http/middlewares/auth";

interface Params {
	id: string;
}

export async function deleteCustomer(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.delete<{ Params: Params }>(
			"/customers/:id",
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

				const orderExisted = await db
					.select()
					.from(orders)
					.where(
						and(
							eq(orders.organizationId, organizationId),
							eq(orders.customerId, id),
						),
					);

				if (orderExisted.length > 0) {
					throw new Error(
						"Este cliente não pode ser deleto, pois possui um pedido",
					);
				}

				await db
					.delete(customers)
					.where(
						and(
							eq(customers.organizationId, organizationId),
							eq(customers.id, id),
						),
					);

				return reply.status(200).send({});
			},
		);
}
