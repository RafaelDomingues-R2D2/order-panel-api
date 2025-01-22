import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { db } from '@/db/connection'
import { categories } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

export async function getCategories(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get('/categories', async (request) => {
			const organizationId = await request.getCurrentOrganizationIdOfUser()

			const result = await db
				.select()
				.from(categories)
				.where(eq(categories.organizationId, organizationId))

			return { categories: result }
		})
}
