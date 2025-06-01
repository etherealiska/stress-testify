import Redis from "ioredis";
import { MessageQueue } from "../interfaces/messageQueue";
import { Order } from "../types/order";

export class RedisStream implements MessageQueue {
  constructor(private redis: Redis) { }

  async add(order: Order) { 
    const streamKey = 'orderStream';

    await this.redis.xadd(
      streamKey,
      'id', order.id,
      'userId', order.userId,
      'productId', order.productId,
      'createdAt', order.createdAt
    );

    console.log(`Pushed order ${order.id} to stream`);
  }
}
