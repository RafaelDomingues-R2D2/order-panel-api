import 'fastify'

declare module 'fastify' {
	export interface FastifyRequest {
		getCurrentUserId(): Promise<string>
		getCurrentOrganizationIdOfUser(): Promise<string>
	}
}
