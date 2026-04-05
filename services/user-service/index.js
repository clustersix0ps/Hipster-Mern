require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB')).catch(err => console.error('MongoDB connection error:', err));

app.get('/health', (req, res) => res.json({ status: 'OK', service: 'user-service' }));
app.get('/api/user', (req, res) => res.json({ message: 'Hello from user-service', data: [] }));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log($(System.Collections.Hashtable.name) running on port ${PORT}));

