// @desc    Get recommendations
// @route   GET /recommendation
// @access  Internal
const getRecommendations = async (req, res) => {
    try {
        const { productIds } = req.query; // array of product IDs to base recommendation on

        // Mock logic: return random array of product ids representing recommendations
        const mockCatalogIds = [
            "OLJCESPC7Z", "66VCHSJNUP", "1YMWWN1N4O", "L9ECAV7KIM",
            "2ZYFJ3GM2N", "0PUK6V6EV0", "LS4PSXUNUM", "9SIQT8TOJO", "6E92ZMYYFZ"
        ];

        // Pick 4 random ones from the catalog that aren't in the productIds list if provided
        let available = mockCatalogIds;
        if (productIds) {
            const inputIds = Array.isArray(productIds) ? productIds : [productIds];
            available = mockCatalogIds.filter(id => !inputIds.includes(id));
        }

        const shuffled = available.sort(() => 0.5 - Math.random());
        const recommendations = shuffled.slice(0, 4);

        res.status(200).json({ productIds: recommendations });
    } catch (error) {
        console.error('Error generating recommendations:', error);
        res.status(500).json({ message: 'Recommendation Failed', error: error.message });
    }
};

module.exports = {
    getRecommendations
};
