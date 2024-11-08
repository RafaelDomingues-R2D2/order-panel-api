import { eq } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db/connection'
import { orderItems, orders, payments, products } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

import { BadRequestError } from '../_errors/bad-request-error'

export async function createOrder(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/orders',
      {
        schema: {
          body: z.object({
            customerId: z.string(),
            shippingAddressId: z.string(),
            items: z.array(
              z.object({
                id: z.string(),
                quantity: z.number(),
              }),
            ),
          }),
        },
      },
      async (request, reply) => {
        const { customerId, shippingAddressId, items } = request.body

        const organizationId = await request.getCurrentOrganizationIdOfUser()

        const order = await db
          .insert(orders)
          .values({
            customerId,
            shippingAddressId,
            status: 'PENDING',
            priority: 'NORMAL',
            organizationId,
          })
          .returning()

        let totalAmount = 0
        let totalItems = 0

        for (const item of items) {
          const itemExistes = await db
            .select()
            .from(products)
            .where(eq(products.id, item.id))

          if (!itemExistes) {
            throw new BadRequestError('Produto não existe')
          }

          if (Number(itemExistes[0].stock) < item.quantity) {
            throw new BadRequestError(
              `Produto com estoque insuficiente. Estoque do produto: ${itemExistes[0].stock}`,
            )
          }

          await db.insert(orderItems).values({
            orderId: order[0].id,
            productId: itemExistes[0].id,
            quantity: item.quantity,
            price: itemExistes[0].price,
            organizationId,
          })

          await db
            .update(products)
            .set({ stock: Number(itemExistes[0].stock) - item.quantity })
            .where(eq(products.id, itemExistes[0].id))

          totalItems = totalItems + item.quantity
          totalAmount =
            totalAmount + Number(itemExistes[0].price) * item.quantity
        }

        await db.insert(payments).values({
          orderId: order[0].id,
          amount: totalAmount,
          method: 'CREDIT_CARD',
          status: 'PENDING',
          organizationId,
        })

        const updatedOrder = await db
          .update(orders)
          .set({ totalAmount, totalItems })
          .where(eq(orders.id, order[0].id))
          .returning()

        return reply.status(201).send({
          order: updatedOrder,
        })
      },
    )
}
