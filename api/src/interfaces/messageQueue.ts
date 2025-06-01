import { Order } from "../types/order";

export interface MessageQueue {
  add(order: Order): void;
}
