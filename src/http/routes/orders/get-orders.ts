import { and, desc, eq, sum } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { db } from "@/db/connection";
import { customers, orderItems, orderStages, orders } from "@/db/schema";
import { auth } from "@/http/middlewares/auth";

export async function getOrders(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get("/orders", {}, async (request) => {
			const organizationId = await request.getCurrentOrganizationIdOfUser();

			const todo = await db
				.select({
					id: orders.id,
					deliveryDate: orders.deliveryDate,
					totalAmount: orders.total,
					totalItems: sum(orderItems.quantity),
					customerName: customers.name,
					customerPhone: customers.phone,
				})
				.from(orders)
				.innerJoin(orderStages, eq(orders.orderStageId, orderStages.id))
				.innerJoin(customers, eq(orders.customerId, customers.id))
				.leftJoin(orderItems, eq(orders.id, orderItems.orderId))
				.where(
					and(
						eq(orders.organizationId, organizationId),
						eq(orderStages.name, "TODO"),
					),
				)
				.groupBy(orders.id, customers.name, customers.phone)
				.orderBy(desc(orders.createdAt));

			const doing = await db
				.select({
					id: orders.id,
					deliveryDate: orders.deliveryDate,
					totalAmount: orders.total,
					totalItems: sum(orderItems.quantity),
					customerName: customers.name,
					customerPhone: customers.phone,
				})
				.from(orders)
				.innerJoin(orderStages, eq(orders.orderStageId, orderStages.id))
				.innerJoin(customers, eq(orders.customerId, customers.id))
				.leftJoin(orderItems, eq(orders.id, orderItems.orderId))
				.where(
					and(
						eq(orders.organizationId, organizationId),
						eq(orderStages.name, "DOING"),
					),
				)
				.groupBy(orders.id, customers.name, customers.phone)
				.orderBy(desc(orders.createdAt));

			const done = await db
				.select({
					id: orders.id,
					deliveryDate: orders.deliveryDate,
					totalAmount: orders.total,
					totalItems: sum(orderItems.quantity),
					customerName: customers.name,
					customerPhone: customers.phone,
				})
				.from(orders)
				.innerJoin(orderStages, eq(orders.orderStageId, orderStages.id))
				.innerJoin(customers, eq(orders.customerId, customers.id))
				.leftJoin(orderItems, eq(orders.id, orderItems.orderId))
				.where(
					and(
						eq(orders.organizationId, organizationId),
						eq(orderStages.name, "DONE"),
					),
				)
				.groupBy(orders.id, customers.name, customers.phone)
				.orderBy(desc(orders.createdAt));

			return { TODO: todo, DOING: doing, DONE: done };
		});
}
