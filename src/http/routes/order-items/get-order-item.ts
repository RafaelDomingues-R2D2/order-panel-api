import { and, eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { db } from "@/db/connection";
import { orderItems } from "@/db/schema";
import { auth } from "@/http/middlewares/auth";

interface Params {
	id: string;
}

export async function getOrderItem(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get<{ Params: Params }>("/order-items/:id", async (request, params) => {
			const organizationId = await request.getCurrentOrganizationIdOfUser();

			const { id } = request.params;

			const orderItem = await db
				.select({
					id: orderItems.id,
					orderId: orderItems.orderId,
					productId: orderItems.productId,
					quantity: orderItems.quantity,
					total: orderItems.total,
				})
				.from(orderItems)
				.where(
					and(
						eq(orderItems.organizationId, organizationId),
						eq(orderItems.id, id),
					),
				);

			return { orderItem: orderItem[0] };
		});
}
