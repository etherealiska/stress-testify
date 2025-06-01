import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import Redis from 'ioredis'
import { randomUUID } from 'crypto'
import { RedisStream } from './adapters/redisStream'
import { MessageQueue } from './interfaces/messageQueue'
import { Order, OrderRequest } from './types/order'

const fastify = Fastify()
const redis = new Redis()

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

fastify.post('/orders', { schema: orderSchema }, handleOrder(redisList))

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

function handleOrder(queue: MessageQueue) {
  return async (request: FastifyRequest<OrderRequest>, reply: FastifyReply) => {
    const { userId, productId } = request.body

    const order: Order = {
      id: randomUUID(),
      userId,
      productId,
      createdAt: new Date().toISOString()
    }

    await queue.add(order)

    reply.code(202).send({ status: 'queued', orderId: order.id })
  }
}