import { eq } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { db } from '@/db/connection'
import { orders } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

export async function getOrders(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get('/orders', {}, async (request) => {
      const organizationId = await request.getCurrentOrganizationIdOfUser()

      const result = await db
        .select()
        .from(orders)
        .where(eq(orders.organizationId, organizationId))

      return { orders: result }
    })
}
