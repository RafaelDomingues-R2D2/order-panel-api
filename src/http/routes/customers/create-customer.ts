import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db/connection'
import { customers } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

export async function createCustomer(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.post(
			'/customers',
			{
				schema: {
					body: z.object({
						name: z.string(),
						email: z.string().optional(),
						phone: z.string(),
					}),
				},
			},
			async (request, reply) => {
				const { name, email, phone } = request.body

				const organizationId = await request.getCurrentOrganizationIdOfUser()

				const customer = await db
					.insert(customers)
					.values({
						name,
						email,
						phone,
						organizationId,
					})
					.returning()

				return reply.status(201).send({
					customer,
				})
			},
		)
}
