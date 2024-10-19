import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { db } from '@/db/connection'
import { auth } from '@/http/middlewares/auth'

import { BadRequestError } from '../_errors/bad-request-error'

export async function getProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/profile',

      async (request, reply) => {
        const { sub } = await request.jwtVerify<{ sub: string }>()

        const user = await db.query.users.findFirst({
          where(fields, { eq }) {
            return eq(fields.id, sub)
          },
        })

        if (!user) {
          throw new BadRequestError('User not found.')
        }

        return reply.send({ user })
      },
    )
}
