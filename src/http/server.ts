import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { authenticateWithPassword } from './routes/auth/authenticate-with-password'
import { createAccount } from './routes/auth/create-account'
import { getProfile } from './routes/auth/get-profile'
import { createCategory } from './routes/categories/create-category'
import { createCustomer } from './routes/customers/create-customer'
import { createCustomerAddresse } from './routes/customers-addresses/create-customer-address'
import { createMember } from './routes/members/create-member'
import { createOrder } from './routes/orders/create-order'
import { createOrganization } from './routes/organizations/create-organization'
import { createProduct } from './routes/products/create-product'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifyJwt, { secret: String(process.env.JWT_SECRET) })

app.register(fastifyCors)

app.register(createAccount)
app.register(authenticateWithPassword)
app.register(getProfile)
app.register(createOrganization)
app.register(createMember)
app.register(createCategory)
app.register(createProduct)
app.register(createCustomer)
app.register(createCustomerAddresse)
app.register(createOrder)

const port = Number(process.env.PORT) || 3333
const address = '0.0.0.0'

app.listen({ port, host: address }).then(() => {
  console.log('HTTP server running!')
})
