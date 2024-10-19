import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { db } from '@/db/connection'
import { users } from '@/db/schema'

import { BadRequestError } from '../_errors/bad-request-error'

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body

      const userWithSameEmail = await db.query.users.findFirst({
        where(fields, { eq }) {
          return eq(fields.email, email)
        },
      })

      if (userWithSameEmail) {
        throw new BadRequestError('Use with same e-mail already exists.')
      }

      const passwordHash = await hash(password, 6)

      await db.insert(users).values({
        name,
        email,
        passwordHash,
      })

      return reply.status(201).send()
    },
  )
}
