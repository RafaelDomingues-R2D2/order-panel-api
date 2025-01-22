import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { db } from '@/db/connection'
import { organizations } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

export async function getOrganizations(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get('/organizations', {}, async (request) => {
			const userId = await request.getCurrentUserId()

			const result = await db
				.select()
				.from(organizations)
				.where(eq(organizations.ownerId, userId))

			return { organizations: result }
		})
}
