const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const cartRoutes = require('./routes/cartRoutes');

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/cart', cartRoutes);

// Health check endpoint
app.get('/_healthz', (req, res) => {
    res.send('ok');
});

const PORT = process.env.PORT || 7070;

app.listen(PORT, () => {
    console.log(`Cart Service running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
