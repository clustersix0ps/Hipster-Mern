const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const recommendationRoutes = require('./routes/recommendationRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Routes
app.use('/recommendation', recommendationRoutes);

// Health check endpoint
app.get('/_healthz', (req, res) => {
    res.send('ok');
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Recommendation Service running on port ${PORT}`);
});
