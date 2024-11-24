import { eq } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { db } from '@/db/connection'
import { customers } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

export async function getCustomers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get('/customers', async (request) => {
      const organizationId = await request.getCurrentOrganizationIdOfUser()

      const result = await db
        .select()
        .from(customers)
        .where(eq(customers.organizationId, organizationId))

      return { customers: result }
    })
}
