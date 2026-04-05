const express = require('express');
const router = express.Router();
const { sendOrderConfirmation } = require('../controllers/emailController');

router.post('/sendOrderConfirmation', sendOrderConfirmation);

module.exports = router;
