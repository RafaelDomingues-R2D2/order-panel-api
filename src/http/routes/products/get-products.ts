import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { db } from '@/db/connection'
import { products } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

export async function getProducts(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get('/products', async (request) => {
			const organizationId = await request.getCurrentOrganizationIdOfUser()

			const result = await db
				.select()
				.from(products)
				.where(eq(products.organizationId, organizationId))

			return { products: result }
		})
}
