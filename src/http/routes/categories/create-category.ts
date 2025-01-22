import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db/connection'
import { categories } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

export async function createCategory(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.post(
			'/categories',
			{
				schema: {
					body: z.object({
						name: z.string(),
						description: z.string().optional(),
					}),
				},
			},
			async (request, reply) => {
				const { name, description } = request.body

				const organizationId = await request.getCurrentOrganizationIdOfUser()

				const category = await db
					.insert(categories)
					.values({
						name,
						description,
						organizationId,
					})
					.returning()

				return reply.status(201).send({
					category,
				})
			},
		)
}
