import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db/connection'
import { customerAddresses } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

export async function createCustomerAddresse(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.post(
			'/customers-addresses',
			{
				schema: {
					body: z.object({
						customerId: z.string(),
						street: z.string(),
						neighborhood: z.string(),
						city: z.string(),
						state: z.string(),
						postalCode: z.string(),
					}),
				},
			},
			async (request, reply) => {
				const { customerId, street, neighborhood, city, state, postalCode } =
					request.body

				const organizationId = await request.getCurrentOrganizationIdOfUser()

				const customerAddresse = await db
					.insert(customerAddresses)
					.values({
						customerId,
						addressType: 'SHIPPING',
						street,
						neighborhood,
						city,
						state,
						postalCode,
						organizationId,
					})
					.returning()

				return reply.status(201).send({
					customerAddresse,
				})
			},
		)
}
