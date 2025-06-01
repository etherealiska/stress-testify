import { Pool } from 'pg';
import { Order } from '../types/order';
import { Messenger } from '../interfaces/messenger';

export class PostgresWriter implements Messenger {
  constructor(private pool: Pool) {}

  async add(order: Order) {
    const query = `
      INSERT INTO orders (id, user_id, product_id, created_at)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (id) DO NOTHING
    `;

    const values = [
      order.id,
      order.userId,
      order.productId,
      order.createdAt,
    ];

    await this.pool.query(query, values);
  }
}