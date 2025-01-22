import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { db } from '@/db/connection'
import { orderStages } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

export async function getOrderStages(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get('/order-stages', {}, async (request) => {
			const organizationId = await request.getCurrentOrganizationIdOfUser()

			const result = await db
				.select()
				.from(orderStages)
				.where(eq(orderStages.organizationId, organizationId))

			return { orderStages: result }
		})
}
