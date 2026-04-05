const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');

dotenv.config();

// Connect to database
// Wait for connection to ensure service is ready
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/products', productRoutes);

// Health check endpoint (matching original Go implementation)
app.get('/_healthz', (req, res) => {
    res.send('ok');
});

const PORT = process.env.PORT || 3550;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
