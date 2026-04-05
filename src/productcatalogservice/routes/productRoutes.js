const express = require('express');
const router = express.Router();
const { getProducts, getProductById, searchProducts } = require('../controllers/productController');

router.route('/search').get(searchProducts);
router.route('/').get(getProducts);
router.route('/:id').get(getProductById);

module.exports = router;
