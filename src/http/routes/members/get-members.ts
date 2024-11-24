import { eq } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { db } from '@/db/connection'
import { members } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

export async function getMembers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get('/members', {}, async (request) => {
      const organizationId = await request.getCurrentOrganizationIdOfUser()

      const result = await db
        .select()
        .from(members)
        .where(eq(members.organizationId, organizationId))

      return { members: result }
    })
}
