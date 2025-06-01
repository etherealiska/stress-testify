import axios from 'axios'
import { randomUUID } from 'crypto'

const API_URL = 'http://localhost:3000/orders'
const USERS = ['alice', 'bob', 'carol', 'dave']
const PRODUCTS = ['laptop', 'headphones', 'monitor', 'keyboard']

const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

async function sendOrder() {
  const order = {
    userId: USERS[Math.floor(Math.random() * USERS.length)],
    productId: PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)],
  }

  try {
    const res = await axios.post(API_URL, order)
    console.log(`✅ Sent order ${res.data.orderId}`)
  } catch (err) {
    console.error('❌ Failed to send order', err.message)
  }
}

async function runLoad(count = 100, delay = 10) {
  for (let i = 0; i < count; i++) {
    await sendOrder()
    await sleep(delay)
  }
}

runLoad(100, 5) // 100 orders, 5ms apart
