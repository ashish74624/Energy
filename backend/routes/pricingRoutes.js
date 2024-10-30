// routes/pricingRoutes.js
const express = require('express');
const router = express.Router();
const Pricing = require('../models/Pricing');

// Endpoint to Get Latest Pricing
router.get('/pricing', async (req, res) => {
    try {
        const latestPricing = await Pricing.find().sort({ timestamp: -1 }).limit(1);
        res.json(latestPricing[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pricing data' });
    }
});

module.exports = router;
