const express = require('express');
const router = express.Router();
const { getQuote, shipOrder } = require('../controllers/shippingController');

router.post('/quote', getQuote);
router.post('/shipOrder', shipOrder);

module.exports = router;
