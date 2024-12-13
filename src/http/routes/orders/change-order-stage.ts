import { eq } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db/connection'
import { orders, orderStages } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

export async function changeOrderStage(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/orders/change-order-stage',
      {
        schema: {
          body: z.object({
            id: z.string(),
            stage: z.string(),
          }),
        },
      },
      async (request, reply) => {
        const { id, stage } = request.body

        const orderStage = await db
          .select({ id: orderStages.id })
          .from(orderStages)
          .where(eq(orderStages.name, stage))

        const order = await db
          .update(orders)
          .set({
            orderStageId: orderStage[0].id,
          })
          .where(eq(orders.id, id))
          .returning()

        return reply.status(201).send({
          order,
        })
      },
    )
}
