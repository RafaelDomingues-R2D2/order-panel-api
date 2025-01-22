import { compare } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { db } from '@/db/connection'
import { members } from '@/db/schema'

import { BadRequestError } from '../_errors/bad-request-error'

export async function authenticateWithPassword(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/sessions/password',
		{
			schema: {
				body: z.object({
					email: z.string().email(),
					password: z.string(),
				}),
			},
		},
		async (request, reply) => {
			const { email, password } = request.body

			const userFromEmail = await db.query.users.findFirst({
				where(fields, { eq }) {
					return eq(fields.email, email)
				},
			})

			if (!userFromEmail) {
				throw new BadRequestError('Invalid credentials.')
			}

			if (userFromEmail.passwordHash === null) {
				throw new BadRequestError(
					"User doesn't have a password, user social login.",
				)
			}

			const isPassswordValid = await compare(
				password,
				userFromEmail.passwordHash,
			)

			if (!isPassswordValid) {
				throw new BadRequestError('Invalid credentials.')
			}

			const organizationMember = await db
				.select({ organizationId: members.organizationId })
				.from(members)
				.where(eq(members.userId, userFromEmail.id))

			const token = await reply.jwtSign(
				{
					sub: userFromEmail.id,
					organizationId: organizationMember[0]?.organizationId,
				},
				{
					sign: {
						expiresIn: '7d',
					},
				},
			)

			return reply.status(201).send({ token })
		},
	)
}
