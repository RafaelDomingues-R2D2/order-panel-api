import { and, eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { db } from "@/db/connection";
import { orders } from "@/db/schema";
import { auth } from "@/http/middlewares/auth";

interface Params {
	id: string;
}
interface Body {
	customerId: string;
	deliveryDate: string;
	pickupeByCustomer: boolean;
}

export async function updateOrder(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.put<{ Params: Params; Body: Body }>(
			"/orders/:id",
			{
				schema: {
					params: z.object({
						id: z.string(),
					}),
					body: z.object({
						customerId: z.string().optional(),
						deliveryDate: z.string().optional(),
						pickupeByCustomer: z.boolean(),
					}),
				},
			},
			async (request, reply) => {
				const { id } = request.params;

				const { customerId, deliveryDate, pickupeByCustomer } = request.body;

				const organizationId = await request.getCurrentOrganizationIdOfUser();

				const order = await db
					.update(orders)
					.set({
						customerId,
						deliveryDate,
						pickupeByCustomer,
					})
					.where(
						and(eq(orders.organizationId, organizationId), eq(orders.id, id)),
					)
					.returning();

				return reply.status(200).send({
					order: order,
				});
			},
		);
}
