const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const emailRoutes = require('./routes/emailRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Routes
app.use('/email', emailRoutes);

// Health check endpoint
app.get('/_healthz', (req, res) => {
    res.send('ok');
});

const PORT = process.env.PORT || 8080; // Default port used by emailservice in architecture

app.listen(PORT, () => {
    console.log(`Email Service running on port ${PORT}`);
});
