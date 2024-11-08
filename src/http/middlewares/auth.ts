import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request, reply) => {
    request.getCurrentUserId = async () => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>()

        return sub
      } catch {
        return reply.status(401).send({ message: 'UNAUTHORIZED' })
      }
    }

    request.getCurrentOrganizationIdOfUser = async () => {
      try {
        const { organizationId } = await request.jwtVerify<{
          organizationId: string
        }>()

        return organizationId
      } catch {
        return reply.status(401).send({ message: 'UNAUTHORIZED' })
      }
    }
  })
})
