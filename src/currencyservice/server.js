const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const currencyRoutes = require('./routes/currencyRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Routes
app.use('/currency', currencyRoutes);

// Health check endpoint
app.get('/_healthz', (req, res) => {
    res.send('ok');
});

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
    console.log(`Currency Service running on port ${PORT}`);
});
