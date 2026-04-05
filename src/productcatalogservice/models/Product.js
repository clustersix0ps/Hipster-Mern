const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
    currencyCode: { type: String, required: true },
    units: { type: Number, required: true },
    nanos: { type: Number, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    picture: { type: String, required: true },
    priceUsd: { type: priceSchema, required: true },
    categories: [{ type: String }],
    details: { type: mongoose.Schema.Types.Mixed }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
