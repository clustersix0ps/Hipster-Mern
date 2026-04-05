const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const shippingRoutes = require('./routes/shippingRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Routes
app.use('/shipping', shippingRoutes);

// Health check endpoint
app.get('/_healthz', (req, res) => {
    res.send('ok');
});

const PORT = process.env.PORT || 50051; 

app.listen(PORT, () => {
    console.log(`Shipping Service running on port ${PORT}`);
});
