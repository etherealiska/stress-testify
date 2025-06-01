const axios = require('axios');

const API_URL = 'http://localhost:3000/'
const USERS = ['alice', 'bob', 'carol', 'dave']
const PRODUCTS = ['laptop', 'headphones', 'monitor', 'keyboard']

const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

async function sendOrder(path) {
  const order = {
    userId: USERS[Math.floor(Math.random() * USERS.length)],
    productId: PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)],
  }

  try {
    const res = await axios.post(`${API_URL}${path}`, order)
    console.log(`✅ Sent order ${res.data.orderId}`)
  } catch (err) {
    console.error('❌ Failed to send order', err.message)
  }
}

async function runWorker(path, orderCount, delay) {
  for (let i = 0; i < orderCount; i++) {
    await sendOrder(path);
    if (delay > 0) await sleep(delay);
  }
}

async function runLoad(path = 'orders', totalOrders = 1000, concurrency = 10, delay = 0) {
  const ordersPerWorker = Math.floor(totalOrders / concurrency);
  const workers = [];

  console.log('orders per worker', ordersPerWorker)

  for (let i = 0; i < concurrency; i++) {
    workers.push(runWorker(path, ordersPerWorker, delay));
  }

  console.time("stress-test");
  await Promise.all(workers);
  console.timeEnd("stress-test");

  console.log(`Sent ~${totalOrders} orders using ${concurrency} workers`);
}

runLoad('orders', 100000, 1000, 0);

// runLoad('ordersSerial', 100000, 1000, 0);
