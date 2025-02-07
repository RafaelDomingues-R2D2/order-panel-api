import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { db } from "@/db/connection";
import { categories, products } from "@/db/schema";
import { auth } from "@/http/middlewares/auth";

export async function getProducts(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get("/products", async (request) => {
			const organizationId = await request.getCurrentOrganizationIdOfUser();

			const result = await db
				.select({
					id: products.id,
					name: products.name,
					description: products.description,
					stock: products.stock,
					price: products.price,
					categoryId: products.categoryId,
					categoryName: categories.name,
				})
				.from(products)
				.innerJoin(categories, eq(categories.id, products.categoryId))
				.where(eq(products.organizationId, organizationId));

			return { products: result };
		});
}
