import { and, eq } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { db } from '@/db/connection'
import { customers, orders, orderStages } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

export async function getOrders(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get('/orders', {}, async (request) => {
      const organizationId = await request.getCurrentOrganizationIdOfUser()

      const todo = await db
        .select({
          id: orders.id,
          totalAmount: orders.totalAmount,
          deliveryDate: orders.deliveryDate,
          totalItems: orders.totalItems,
          customerName: customers.name,
          customerPhone: customers.phone,
        })
        .from(orders)
        .innerJoin(orderStages, eq(orders.orderStageId, orderStages.id))
        .innerJoin(customers, eq(orders.customerId, customers.id))
        .where(
          and(
            eq(orders.organizationId, organizationId),
            eq(orderStages.name, 'TODO'),
          ),
        )

      const doing = await db
        .select({
          id: orders.id,
          totalAmount: orders.totalAmount,
          deliveryDate: orders.deliveryDate,
          totalItems: orders.totalItems,
          customerName: customers.name,
          customerPhone: customers.phone,
        })
        .from(orders)
        .innerJoin(orderStages, eq(orders.orderStageId, orderStages.id))
        .innerJoin(customers, eq(orders.customerId, customers.id))

        .where(
          and(
            eq(orders.organizationId, organizationId),
            eq(orderStages.name, 'DOING'),
          ),
        )

      const done = await db
        .select({
          id: orders.id,
          totalAmount: orders.totalAmount,
          deliveryDate: orders.deliveryDate,
          totalItems: orders.totalItems,
          customerName: customers.name,
          customerPhone: customers.phone,
        })
        .from(orders)
        .innerJoin(orderStages, eq(orders.orderStageId, orderStages.id))
        .innerJoin(customers, eq(orders.customerId, customers.id))
        .where(
          and(
            eq(orders.organizationId, organizationId),
            eq(orderStages.name, 'DONE'),
          ),
        )

      return { TODO: todo, DOING: doing, DONE: done }
    })
}
