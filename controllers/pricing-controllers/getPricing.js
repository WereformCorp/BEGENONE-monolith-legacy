/**
 * @fileoverview Pricing tier retrieval endpoint
 * @module controllers/pricing-controllers/getPricing
 * @layer Controller
 *
 * @description
 * Retrieves all Pricing documents from the database and returns them
 * in the JSON response. Used to populate pricing/plan selection UI.
 *
 * @dependencies
 * - Upstream: pricing route handler
 * - Downstream: Pricing model, catchAsync
 */
const catchAsync = require('../../utils/catchAsync');
const Pricing = require('../../models/pricingModel');

const getPricings = catchAsync(async (req, res, next) => {
  try {
    const pricings = await Pricing.find();

    return res.json({
      pricings,
    });
  } catch (err) {
    console.log(`GET PRICING | PRICING CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = getPricings;
