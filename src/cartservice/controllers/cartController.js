const Cart = require('../models/Cart');

// @desc    Get cart by User ID
// @route   GET /cart/:userId
// @access  Public
const getCart = async (req, res) => {
    try {
        const userId = req.params.userId;
        let cart = await Cart.findOne({ userId });
        
        if (!cart) {
            cart = { userId, items: [] };
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /cart/:userId/items
// @access  Public
const addItemToCart = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ message: 'Product ID and quantity are required' });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [{ productId, quantity }] });
        } else {
            const itemIndex = cart.items.findIndex(item => item.productId === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }
        }

        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Empty cart
// @route   DELETE /cart/:userId
// @access  Public
const emptyCart = async (req, res) => {
    try {
        const userId = req.params.userId;
        const cart = await Cart.findOne({ userId });
        
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        res.json({ message: 'Cart emptied' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getCart,
    addItemToCart,
    emptyCart
};
