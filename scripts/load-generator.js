const axios = require('axios');

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

async function runWorker(orderCount, delay) {
  for (let i = 0; i < orderCount; i++) {
    await sendOrder();
    if (delay > 0) await sleep(delay);
  }
}

async function runLoad(totalOrders = 1000, concurrency = 10, delay = 0) {
  const ordersPerWorker = Math.floor(totalOrders / concurrency);
  const workers = [];

  for (let i = 0; i < concurrency; i++) {
    workers.push(runWorker(ordersPerWorker, delay));
  }

  console.time("stress-test");
  await Promise.all(workers);
  console.timeEnd("stress-test");

  console.log(`Sent ~${totalOrders} orders using ${concurrency} workers`);
}

runLoad(100000, 1000, 0);