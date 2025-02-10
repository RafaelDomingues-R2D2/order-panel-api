import { and, desc, eq, sum } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { db } from "@/db/connection";
import {
	customerAddresses,
	customers,
	orderItems,
	orderStages,
	orders,
} from "@/db/schema";
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
					customerId: customers.id,
					customerName: customers.name,
					customerPhone: customers.phone,
					customerStreet: customerAddresses.street,
					customerNumber: customerAddresses.number,
					customerNeighborhood: customerAddresses.neighborhood,
					customerCity: customerAddresses.city,
				})
				.from(orders)
				.innerJoin(orderStages, eq(orders.orderStageId, orderStages.id))
				.innerJoin(customers, eq(orders.customerId, customers.id))
				.leftJoin(orderItems, eq(orders.id, orderItems.orderId))
				.innerJoin(
					customerAddresses,
					eq(customerAddresses.customerId, customers.id),
				)
				.where(
					and(
						eq(orders.organizationId, organizationId),
						eq(orderStages.name, "TODO"),
					),
				)
				.groupBy(
					orders.id,
					customers.name,
					customers.id,
					customers.phone,
					customerAddresses.street,
					customerAddresses.number,
					customerAddresses.neighborhood,
					customerAddresses.city,
				)
				.orderBy(desc(orders.createdAt));

			const doing = await db
				.select({
					id: orders.id,
					deliveryDate: orders.deliveryDate,
					totalAmount: orders.total,
					totalItems: sum(orderItems.quantity),
					customerId: customers.id,
					customerName: customers.name,
					customerPhone: customers.phone,
					customerStreet: customerAddresses.street,
					customerNumber: customerAddresses.number,
					customerNeighborhood: customerAddresses.neighborhood,
					customerCity: customerAddresses.city,
				})
				.from(orders)
				.innerJoin(orderStages, eq(orders.orderStageId, orderStages.id))
				.innerJoin(customers, eq(orders.customerId, customers.id))
				.leftJoin(orderItems, eq(orders.id, orderItems.orderId))
				.innerJoin(
					customerAddresses,
					eq(customerAddresses.customerId, customers.id),
				)
				.where(
					and(
						eq(orders.organizationId, organizationId),
						eq(orderStages.name, "DOING"),
					),
				)
				.groupBy(
					orders.id,
					customers.name,
					customers.id,
					customers.phone,
					customerAddresses.street,
					customerAddresses.number,
					customerAddresses.neighborhood,
					customerAddresses.city,
				)

				.orderBy(desc(orders.createdAt));

			const done = await db
				.select({
					id: orders.id,
					deliveryDate: orders.deliveryDate,
					totalAmount: orders.total,
					totalItems: sum(orderItems.quantity),
					customerId: customers.id,
					customerName: customers.name,
					customerPhone: customers.phone,
					customerStreet: customerAddresses.street,
					customerNumber: customerAddresses.number,
					customerNeighborhood: customerAddresses.neighborhood,
					customerCity: customerAddresses.city,
				})
				.from(orders)
				.innerJoin(orderStages, eq(orders.orderStageId, orderStages.id))
				.innerJoin(customers, eq(orders.customerId, customers.id))
				.leftJoin(orderItems, eq(orders.id, orderItems.orderId))
				.innerJoin(
					customerAddresses,
					eq(customerAddresses.customerId, customers.id),
				)
				.where(
					and(
						eq(orders.organizationId, organizationId),
						eq(orderStages.name, "DONE"),
					),
				)
				.groupBy(
					orders.id,
					customers.name,
					customers.id,
					customers.phone,
					customerAddresses.street,
					customerAddresses.number,
					customerAddresses.neighborhood,
					customerAddresses.city,
				)

				.orderBy(desc(orders.createdAt));

			return { TODO: todo, DOING: doing, DONE: done };
		});
}
