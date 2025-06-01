import Fastify from 'fastify'
import Redis from 'ioredis'
import { RedisStream } from './adapters/redisStream'
import { handleOrder } from './handlers/orderHandler'
import { Pool } from 'pg'
import { PostgresWriter } from './adapters/db'

const fastify = Fastify()
const redis = new Redis()

const pool = new Pool({ connectionString: 'http://localhost:5432', max: 10 });

const orderSchema = {
  body: {
    type: 'object',
    required: ['userId', 'productId'],
    properties: {
      userId: { type: 'string' },
      productId: { type: 'string' },
    },
  },
} as const

const redisList = new RedisStream(redis);
const db = new PostgresWriter(pool);

fastify.post('/orders', { schema: orderSchema }, handleOrder(redisList))

fastify.post('/ordersSerial', { schema: orderSchema }, handleOrder(db))

fastify.get('/health', async () => {
  return { status: 'ok' }
})

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`🚀 Fastify API running at ${address}`)
})
