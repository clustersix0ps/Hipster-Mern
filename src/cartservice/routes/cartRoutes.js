const express = require('express');
const router = express.Router();
const { getCart, addItemToCart, emptyCart } = require('../controllers/cartController');

router.route('/:userId')
    .get(getCart)
    .delete(emptyCart);

router.route('/:userId/items')
    .post(addItemToCart);

module.exports = router;
