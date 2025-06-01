export interface Order {
  id: string
  userId: string
  productId: string
  createdAt: string
}

export interface OrderRequest {
  Body: {
    userId: string
    productId: string
  }
}
