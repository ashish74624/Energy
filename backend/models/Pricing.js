// models/Pricing.js
const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
    price: Number,
    demand: Number,
    supply: Number,
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Pricing', pricingSchema);
