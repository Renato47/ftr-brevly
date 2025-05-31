import { fastifyCors } from '@fastify/cors'
import { fastify } from 'fastify'
import {
  type ZodTypeProvider,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { env } from './env'
import { exportLinkRoute } from './routes/export-link'
import { linkRoute } from './routes/link'

const server = fastify().withTypeProvider<ZodTypeProvider>()

server.setValidatorCompiler(validatorCompiler)

server.register(fastifyCors, {
  origin: '*',
  methods: '*',
})

server.register(linkRoute)
server.register(exportLinkRoute)

server.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log(`HTTP server running on port ${env.PORT}!`)
})
