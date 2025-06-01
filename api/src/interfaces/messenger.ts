import { Order } from "../types/order";

export interface Messenger {
  add(order: Order): void;
}
