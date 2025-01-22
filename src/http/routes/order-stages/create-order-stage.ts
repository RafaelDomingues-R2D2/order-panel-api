import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db/connection'
import { orderStages } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

export async function createOrderStage(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.post(
			'/order-stages',
			{
				schema: {
					body: z.object({
						name: z.string(),
					}),
				},
			},
			async (request, reply) => {
				const { name } = request.body

				const organizationId = await request.getCurrentOrganizationIdOfUser()

				const orderStage = await db
					.insert(orderStages)
					.values({
						organizationId,
						name,
					})
					.returning()

				return reply.status(201).send({
					orderStage,
				})
			},
		)
}
