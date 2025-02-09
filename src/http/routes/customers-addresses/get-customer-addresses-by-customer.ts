import { and, eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { db } from "@/db/connection";
import { customerAddresses, customers } from "@/db/schema";
import { auth } from "@/http/middlewares/auth";

interface Params {
	customerId: string;
}

export async function getCustomerAddressesByCustomer(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get<{ Params: Params }>(
			"/customers-addresses-by-customer/:customerId",
			async (request) => {
				const organizationId = await request.getCurrentOrganizationIdOfUser();

				const { customerId } = request.params;

				const result = await db
					.select()
					.from(customerAddresses)
					.where(
						and(
							eq(customerAddresses.organizationId, organizationId),
							eq(customerAddresses.customerId, customerId),
						),
					);

				return { customerAddresses: result };
			},
		);
}
