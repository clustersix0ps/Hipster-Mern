const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const checkoutRoutes = require('./routes/checkoutRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Routes
app.use('/checkout', checkoutRoutes);

// Health check endpoint
app.get('/_healthz', (req, res) => {
    res.send('ok');
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
    console.log(`Checkout Service running on port ${PORT}`);
});
