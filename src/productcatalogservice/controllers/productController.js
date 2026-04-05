const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        // Return matching format: { products: [] }
        res.json({ products });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Fetch single product by id
// @route   GET /products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Search products
// @route   GET /products/search?q=
// @access  Public
const searchProducts = async (req, res) => {
    try {
        const query = req.query.q || '';
        const regex = new RegExp(query, 'i');
        const products = await Product.find({
            $or: [
                { name: regex },
                { description: regex }
            ]
        });
        // Return format matching original search implementation
        res.json({ results: products });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    searchProducts
};
