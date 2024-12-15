import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastify from "fastify";
import {
	type ZodTypeProvider,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";

import { errorHandler } from "./error-handler";
import { authenticateWithPassword } from "./routes/auth/authenticate-with-password";
import { createAccount } from "./routes/auth/create-account";
import { getProfile } from "./routes/auth/get-profile";
import { createCategory } from "./routes/categories/create-category";
import { getCategories } from "./routes/categories/get-categories";
import { createCustomerAddresse } from "./routes/customers-addresses/create-customer-address";
import { getCustomerAddresses } from "./routes/customers-addresses/get-customer-addresses";
import { createCustomer } from "./routes/customers/create-customer";
import { getCustomers } from "./routes/customers/get-customers";
import { createMember } from "./routes/members/create-member";
import { getMembers } from "./routes/members/get-members";
import { createOrderStage } from "./routes/order-stages/create-order-stage";
import { getOrderStages } from "./routes/order-stages/get-order-stages";
import { changeOrderStage } from "./routes/orders/change-order-stage";
import { createOrder } from "./routes/orders/create-order";
import { getOrders } from "./routes/orders/get-orders";
import { createOrganization } from "./routes/organizations/create-organization";
import { getOrganizations } from "./routes/organizations/get-organizations";
import { createProduct } from "./routes/products/create-product";
import { getProducts } from "./routes/products/get-products";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.setErrorHandler(errorHandler);

app.register(fastifyJwt, { secret: String(process.env.JWT_SECRET) });

app.register(fastifyCors);

app.register(createAccount);
app.register(authenticateWithPassword);
app.register(getProfile);

app.register(createOrganization);
app.register(getOrganizations);

app.register(createMember);
app.register(getMembers);

app.register(createCategory);
app.register(getCategories);

app.register(createProduct);
app.register(getProducts);

app.register(createCustomer);
app.register(getCustomers);

app.register(createCustomerAddresse);
app.register(getCustomerAddresses);

app.register(createOrder);
app.register(getOrders);
app.register(changeOrderStage);

app.register(createOrderStage);
app.register(getOrderStages);

const port = Number(process.env.PORT) || 3333;
const address = "0.0.0.0";

app.listen({ port, host: address }).then(() => {
	console.log("HTTP server running!");
});
