require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const { createProxyMiddleware } = require('http-proxy-middleware');

// Simple Gateway Routing
app.use('/api/auth', createProxyMiddleware({ target: 'http://auth-service:3001', changeOrigin: true }));
app.use('/api/user', createProxyMiddleware({ target: 'http://user-service:3002', changeOrigin: true }));
app.use('/api/product', createProxyMiddleware({ target: 'http://product-service:3003', changeOrigin: true }));
app.use('/api/order', createProxyMiddleware({ target: 'http://order-service:3004', changeOrigin: true }));
app.use('/api/cart', createProxyMiddleware({ target: 'http://cart-service:3005', changeOrigin: true }));
app.use('/api/payment', createProxyMiddleware({ target: 'http://payment-service:3006', changeOrigin: true }));
app.use('/api/notification', createProxyMiddleware({ target: 'http://notification-service:3007', changeOrigin: true }));
app.use('/api/review', createProxyMiddleware({ target: 'http://review-service:3008', changeOrigin: true }));
app.use('/api/inventory', createProxyMiddleware({ target: 'http://inventory-service:3009', changeOrigin: true }));
app.use('/api/analytics', createProxyMiddleware({ target: 'http://analytics-service:3010', changeOrigin: true }));

app.get('/health', (req, res) => res.json({ status: 'Gateway OK' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log($(System.Collections.Hashtable.name) running on port ${PORT}));

