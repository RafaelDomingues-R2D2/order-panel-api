import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db/connection'
import { members } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

export async function createMember(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.post(
			'/members',
			{
				schema: {
					body: z.object({
						userId: z.string(),
						organizationId: z.string(),
					}),
				},
			},
			async (request, reply) => {
				const { userId, organizationId } = request.body

				const member = await db
					.insert(members)
					.values({
						role: 'MEMBER',
						userId,
						organizationId,
					})
					.returning()

				return reply.status(201).send({
					member,
				})
			},
		)
}
