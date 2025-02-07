import { and, count, eq, gte, sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { db } from "@/db/connection";
import { orders } from "@/db/schema";
import { auth } from "@/http/middlewares/auth";
import dayjs from "dayjs";

export async function getMonthOrdersAmount(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get(
			"/metrics/month-orders-amount",

			async (request) => {
				const organizationId = await request.getCurrentOrganizationIdOfUser();

				const today = dayjs();
				const lastMonth = today.subtract(1, "month");
				const startOfLastMonth = lastMonth.startOf("month");

				const lastMonthWithYear = lastMonth.format("YYYY-MM");
				const currentMonthWithYear = today.format("YYYY-MM");

				const ordersPerMonth = await db
					.select({
						monthWithYear: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
						amount: count(orders.id),
					})
					.from(orders)
					.where(
						and(
							eq(orders.organizationId, organizationId),
							gte(orders.createdAt, startOfLastMonth.toDate()),
						),
					)
					.groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`)
					.having(({ amount }) => gte(amount, 1));

				const currentMonthOrdersAmount = ordersPerMonth.find(
					(ordersInMonth) => {
						return ordersInMonth.monthWithYear === currentMonthWithYear;
					},
				);

				const lastMonthOrdersAmount = ordersPerMonth.find((ordersInMonth) => {
					return ordersInMonth.monthWithYear === lastMonthWithYear;
				});

				const diffFromLastMonth =
					lastMonthOrdersAmount && currentMonthOrdersAmount
						? (currentMonthOrdersAmount.amount * 100) /
							lastMonthOrdersAmount.amount
						: null;

				return {
					amount: currentMonthOrdersAmount?.amount ?? 0,
					diffFromLastMonth: diffFromLastMonth
						? Number((diffFromLastMonth - 100).toFixed(2))
						: 0,
				};
			},
		);
}
