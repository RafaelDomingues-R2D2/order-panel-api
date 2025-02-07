import { and, eq, gte, sql, sum } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { db } from "@/db/connection";
import { orderItems, orders } from "@/db/schema";
import { auth } from "@/http/middlewares/auth";
import dayjs from "dayjs";

export async function getMonthRevenue(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get(
			"/metrics/month-revenue",

			async (request) => {
				const organizationId = await request.getCurrentOrganizationIdOfUser();

				const today = dayjs();
				const lastMonth = today.subtract(1, "month");
				const startOfLastMonth = lastMonth.startOf("month");

				const lastMonthWithYear = lastMonth.format("YYYY-MM");
				const currentMonthWithYear = today.format("YYYY-MM");

				const monthsRevenues = await db
					.select({
						monthWithYear: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
						revenue: sum(orders.total).mapWith(Number),
					})
					.from(orders)
					.where(
						and(
							eq(orders.organizationId, organizationId),
							gte(orders.createdAt, startOfLastMonth.toDate()),
						),
					)
					.groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`)
					.having(({ revenue }) => gte(revenue, 1));

				const currentMonthRevenue = monthsRevenues.find((monthsRevenue) => {
					return monthsRevenue.monthWithYear === currentMonthWithYear;
				});

				const lastMonthReceipt = monthsRevenues.find((monthsRevenue) => {
					return monthsRevenue.monthWithYear === lastMonthWithYear;
				});

				const diffFromLastMonth =
					lastMonthReceipt && currentMonthRevenue
						? (currentMonthRevenue.revenue * 100) / lastMonthReceipt.revenue
						: null;

				return {
					revenue: currentMonthRevenue?.revenue ?? 0,
					diffFromLastMonth: diffFromLastMonth
						? Number((diffFromLastMonth - 100).toFixed(2))
						: 0,
				};
			},
		);
}
