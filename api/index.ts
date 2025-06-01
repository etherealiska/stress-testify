import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import Redis from 'ioredis'
import { randomUUID } from 'crypto'

const fastify = Fastify()
const redis = new Redis()

interface Order {
  id: string
  userId: string
  productId: string
  createdAt: string
}

interface OrderRequest {
  Body: {
    userId: string
    productId: string
  }
}

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

interface MessageQueue {
  add(order: Order): void;
}

class RedisStream implements MessageQueue {
  constructor(private redis: Redis) { }

  async add(order: Order) { 
    const streamKey = 'orderStream';

    await redis.xadd(
      streamKey,
      'id', order.id,
      'userId', order.userId,
      'productId', order.productId,
      'createdAt', order.createdAt
    );

    console.log(`Pushed order ${order.id} to stream`);
  }
}

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