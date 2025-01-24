import { and, eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { db } from "@/db/connection";
import { customers, orderItems, orderStages, orders } from "@/db/schema";
import { auth } from "@/http/middlewares/auth";

interface Params {
	id: string;
}

export async function getOrder(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get<{ Params: Params }>("/orders/:id", async (request, params) => {
			const organizationId = await request.getCurrentOrganizationIdOfUser();

			const { id } = request.params;

			const order = await db
				.select({
					id: orders.id,
					deliveryDate: orders.deliveryDate,
					customerId: customers.id,
					customerName: customers.name,
					customerPhone: customers.phone,
				})
				.from(orders)
				.innerJoin(orderStages, eq(orders.orderStageId, orderStages.id))
				.innerJoin(customers, eq(orders.customerId, customers.id))
				.leftJoin(orderItems, eq(orders.id, orderItems.orderId))
				.where(
					and(eq(orders.organizationId, organizationId), eq(orders.id, id)),
				);

			return { order: order[0] };
		});
}
