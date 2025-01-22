import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db/connection'
import { organizations } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

export async function createOrganization(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.post(
			'/organizations',
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

				const userId = await request.getCurrentUserId()

				const organization = await db
					.insert(organizations)
					.values({
						name,
						description: description ?? '',
						ownerId: userId,
					})
					.returning()

				return reply.status(201).send({
					organization,
				})
			},
		)
}
