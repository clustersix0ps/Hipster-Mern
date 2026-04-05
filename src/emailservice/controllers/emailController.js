// @desc    Send order confirmation email
// @route   POST /email/sendOrderConfirmation
// @access  Internal
const sendOrderConfirmation = async (req, res) => {
    try {
        const { email, order } = req.body;
        
        if (!email || !order) {
            return res.status(400).json({ message: 'Email and order details are required' });
        }

        // Mock email sending logic
        console.log(`Sending order confirmation context to ${email}`);
        console.log(`Order ID: ${order.orderId}, Total: $${order.totalPrice}`);

        res.status(200).json({ message: `Order confirmation successfully sent to ${email}` });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    sendOrderConfirmation
};
