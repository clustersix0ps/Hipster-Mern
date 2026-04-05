const express = require('express');
const router = express.Router();
const { getSupportedCurrencies, convertCurrency } = require('../controllers/currencyController');

router.get('/supported', getSupportedCurrencies);
router.post('/convert', convertCurrency);

module.exports = router;
