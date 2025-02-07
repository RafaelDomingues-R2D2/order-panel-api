import { and, count, eq, gte, sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { db } from "@/db/connection";
import { orders } from "@/db/schema";
import { auth } from "@/http/middlewares/auth";
import dayjs from "dayjs";

export async function getDayOrdersAmount(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get(
			"/metrics/day-orders-amount",
			
			async (request) => {
				const organizationId = await request.getCurrentOrganizationIdOfUser();

        const today = dayjs()
        const yesterday = today.subtract(1, 'day')
        const startOfYesterday = yesterday.startOf('day')

    const yesterdayWithMonthAndYear = yesterday.format('YYYY-MM-DD')
    const todayWithMonthAndYear = today.format('YYYY-MM-DD')

    const ordersPerDay = await db
      .select({
        dayWithMonthAndYear: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`,
        amount: count(orders.id),
      })
      .from(orders)
      .where(
        and(
          eq(orders.organizationId, organizationId),
          gte(orders.createdAt, startOfYesterday.toDate()),
        ),
      )
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`)
      .having(({ amount }) => gte(amount, 1))

      const todayOrdersAmount = ordersPerDay.find((orderInDay) => {
        return orderInDay.dayWithMonthAndYear === todayWithMonthAndYear
      })

      const yesterdayOrdersAmount = ordersPerDay.find((orderInDay) => {
        return orderInDay.dayWithMonthAndYear === yesterdayWithMonthAndYear
      })

      const diffFromYesterday =
      yesterdayOrdersAmount && todayOrdersAmount
        ? (todayOrdersAmount.amount * 100) / yesterdayOrdersAmount.amount
        : null

    return {
      amount: todayOrdersAmount?.amount ?? 0,
      diffFromYesterday: diffFromYesterday
        ? Number((diffFromYesterday - 100).toFixed(2))
        : 0,
    }
});

   
}
