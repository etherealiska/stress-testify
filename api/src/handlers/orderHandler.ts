import { FastifyReply, FastifyRequest } from "fastify"
import { Messenger } from "../interfaces/messenger"
import { Order, OrderRequest } from "../types/order"
import { randomUUID } from "crypto"

export function handleOrder(messenger: Messenger) {
  return async (request: FastifyRequest<OrderRequest>, reply: FastifyReply) => {

    const { userId, productId } = request.body

    const order: Order = {
      id: randomUUID(),
      userId,
      productId,
      createdAt: new Date().toISOString()
    }

    try {
      await messenger.add(order)
    } catch (e) {
      reply.code(500).send({ status: 'error', message: e })
      return;
    }

    reply.code(202).send({ status: 'queued', orderId: order.id })
  }
}
