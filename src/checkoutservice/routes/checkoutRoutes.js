const express = require('express');
const router = express.Router();
const { placeOrder } = require('../controllers/checkoutController');

router.post('/placeOrder', placeOrder);

module.exports = router;
