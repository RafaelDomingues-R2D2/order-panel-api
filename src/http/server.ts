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
import { deleteCategory } from "./routes/categories/delete-category";
import { getCategories } from "./routes/categories/get-categories";
import { updateCategory } from "./routes/categories/update-category";
import { createCustomerAddresse } from "./routes/customers-addresses/create-customer-address";
import { deleteCustomerAddress } from "./routes/customers-addresses/delete-customer-address";
import { getCustomerAddresses } from "./routes/customers-addresses/get-customer-addresses";
import { getCustomerAddressesByCustomer } from "./routes/customers-addresses/get-customer-addresses-by-customer";
import { updateCustomerAddress } from "./routes/customers-addresses/update-customer-address";
import { createCustomer } from "./routes/customers/create-customer";
import { deleteCustomer } from "./routes/customers/delete-customer";
import { getCustomers } from "./routes/customers/get-customers";
import { updateCustomer } from "./routes/customers/update-customer";
import { createMember } from "./routes/members/create-member";
import { getMembers } from "./routes/members/get-members";
import { getDayOrdersAmount } from "./routes/metrics/get-day-orders-amount";
import { getMonthOrdersAmount } from "./routes/metrics/get-month-orders-amount";
import { getMonthRevenue } from "./routes/metrics/get-month-revenue";
import { createOrderItem } from "./routes/order-items/create-order-item";
import { deleteOrderItem } from "./routes/order-items/delete-order-item";
import { getOrderItem } from "./routes/order-items/get-order-item";
import { getOrderItems } from "./routes/order-items/get-order-items";
import { updateOrderItem } from "./routes/order-items/update-order-items";
import { createOrderStage } from "./routes/order-stages/create-order-stage";
import { getOrderStages } from "./routes/order-stages/get-order-stages";
import { changeOrderStage } from "./routes/orders/change-order-stage";
import { createOrder } from "./routes/orders/create-order";
import { deleteOrder } from "./routes/orders/delete-order";
import { getOrder } from "./routes/orders/get-order";
import { getOrders } from "./routes/orders/get-orders";
import { updateOrder } from "./routes/orders/update-order";
import { createOrganization } from "./routes/organizations/create-organization";
import { getOrganizations } from "./routes/organizations/get-organizations";
import { createProduct } from "./routes/products/create-product";
import { deleteProduct } from "./routes/products/delete-product";
import { getProducts } from "./routes/products/get-products";
import { StockEntry } from "./routes/products/stock-entry";
import { updateProduct } from "./routes/products/update-product";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.setErrorHandler(errorHandler);

app.register(fastifyJwt, { secret: String(process.env.JWT_SECRET) });

app.register(fastifyCors);

// Accounts
app.register(createAccount);
app.register(authenticateWithPassword);
app.register(getProfile);

// Organizations
app.register(createOrganization);
app.register(getOrganizations);

// Members
app.register(createMember);
app.register(getMembers);

// Categories
app.register(createCategory);
app.register(getCategories);
app.register(updateCategory);
app.register(deleteCategory);

// Products
app.register(createProduct);
app.register(getProducts);
app.register(updateProduct);
app.register(StockEntry);
app.register(deleteProduct);

// Customers
app.register(createCustomer);
app.register(getCustomers);
app.register(updateCustomer);
app.register(deleteCustomer);

// Customer Addresses
app.register(createCustomerAddresse);
app.register(getCustomerAddresses);
app.register(getCustomerAddressesByCustomer);
app.register(updateCustomerAddress);
app.register(deleteCustomerAddress);

// Orders
app.register(createOrder);
app.register(getOrders);
app.register(getOrder);
app.register(updateOrder);
app.register(deleteOrder);
app.register(changeOrderStage);

// Order Stages
app.register(createOrderStage);
app.register(getOrderStages);

// Order Item
app.register(createOrderItem);
app.register(updateOrderItem);
app.register(getOrderItems);
app.register(getOrderItem);
app.register(deleteOrderItem);

// Metrics
app.register(getDayOrdersAmount);
app.register(getMonthOrdersAmount);
app.register(getMonthRevenue);

const port = Number(process.env.PORT) || 3333;
const address = "0.0.0.0";

app.listen({ port, host: address }).then(() => {
	console.log("HTTP server running!");
});
