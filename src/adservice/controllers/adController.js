// @desc    Get ads based on context
// @route   GET /ad
// @access  Internal
const getAds = async (req, res) => {
    try {
        const { contextKeys } = req.query; // context categories

        const adDB = [
            { redirectUrl: "/product/2ZYFJ3GM2N", text: "Hairdryer for sale. 50% off." },
            { redirectUrl: "/product/66VCHSJNUP", text: "Tank top for sale. 20% off." },
            { redirectUrl: "/product/1YMWWN1N4O", text: "Watch for sale. Buy one, get second kit for free" },
            { redirectUrl: "/product/L9ECAV7KIM", text: "Loafers for sale. Buy one, get second one for free" },
            { redirectUrl: "/product/LS4PSXUNUM", text: "Salt & Pepper shakers. 10% off." }
        ];

        // Pick 2 random ads from the db
        const shuffled = adDB.sort(() => 0.5 - Math.random());
        const ads = shuffled.slice(0, 2);

        res.status(200).json({ ads });
    } catch (error) {
        console.error('Error getting ads:', error);
        res.status(500).json({ message: 'Ads Failed', error: error.message });
    }
};

module.exports = {
    getAds
};
