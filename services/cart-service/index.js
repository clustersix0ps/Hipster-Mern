require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const redis = require('redis');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB')).catch(err => console.error('MongoDB connection error:', err));

// Initialize Redis Client
const redisClient = redis.createClient({ url: process.env.REDIS_URL || 'redis://redis:6379' });
redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.connect().then(() => console.log('Connected to Redis')).catch(console.error);

app.get('/health', (req, res) => res.json({ status: 'OK', service: 'cart-service' }));
app.get('/api/cart', (req, res) => res.json({ message: 'Hello from cart-service', data: [] }));

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log($(System.Collections.Hashtable.name) running on port ${PORT}));

