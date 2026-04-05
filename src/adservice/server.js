const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const adRoutes = require('./routes/adRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Routes
app.use('/ad', adRoutes);

// Health check endpoint
app.get('/_healthz', (req, res) => {
    res.send('ok');
});

const PORT = process.env.PORT || 9555;

app.listen(PORT, () => {
    console.log(`Ad Service running on port ${PORT}`);
});
