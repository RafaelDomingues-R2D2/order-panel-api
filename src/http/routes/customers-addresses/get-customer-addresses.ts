import { eq } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { db } from '@/db/connection'
import { customerAddresses } from '@/db/schema'
import { auth } from '@/http/middlewares/auth'

export async function getCustomerAddresses(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get('/customers-addresses', {}, async (request) => {
      const organizationId = await request.getCurrentOrganizationIdOfUser()

      const result = await db
        .select()
        .from(customerAddresses)
        .where(eq(customerAddresses.organizationId, organizationId))

      return { customerAddresses: result }
    })
}
