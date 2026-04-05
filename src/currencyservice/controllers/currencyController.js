const data = require('../data/currency_conversion.json');

// Helper function
function _carry(amount) {
    const fractionSize = Math.pow(10, 9);
    amount.nanos += (amount.units % 1) * fractionSize;
    amount.units = Math.floor(amount.units) + Math.floor(amount.nanos / fractionSize);
    amount.nanos = amount.nanos % fractionSize;
    return amount;
}

// @desc    List supported currencies
// @route   GET /currency/supported
// @access  Internal
const getSupportedCurrencies = (req, res) => {
    try {
        res.json({ currencyCodes: Object.keys(data) });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Convert currency
// @route   POST /currency/convert
// @access  Internal
const convertCurrency = (req, res) => {
    try {
        const { from, toCode } = req.body;

        if (!from || !toCode || !data[from.currencyCode] || !data[toCode]) {
            return res.status(400).json({ message: 'Invalid currency details' });
        }

        const euros = _carry({
            units: from.units / data[from.currencyCode],
            nanos: from.nanos / data[from.currencyCode]
        });

        euros.nanos = Math.round(euros.nanos);

        const result = _carry({
            units: euros.units * data[toCode],
            nanos: euros.nanos * data[toCode]
        });

        result.units = Math.floor(result.units);
        result.nanos = Math.floor(result.nanos);
        result.currencyCode = toCode;

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Conversion failed', error: error.message });
    }
};

module.exports = {
    getSupportedCurrencies,
    convertCurrency
};
