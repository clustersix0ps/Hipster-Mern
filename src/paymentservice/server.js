const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Routes
app.use('/payment', paymentRoutes);

// Health check endpoint
app.get('/_healthz', (req, res) => {
    res.send('ok');
});

const PORT = process.env.PORT || 50051; // original paymentservice port format

app.listen(PORT, () => {
    console.log(`Payment Service running on port ${PORT}`);
});
