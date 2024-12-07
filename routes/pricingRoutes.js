const express = require('express');
// const pricingController = require('../controllers/pricingController');
// const authController = require('../controllers/authController');
const getPricings = require('../controllers/pricing-controllers/getPricing');
const getCheckoutSession = require('../controllers/pricing-controllers/getCheckoutSession');
const protect = require('../controllers/auth-controllers/protect');

// console.log(`PROTECT:`, protect);

const router = express.Router({ mergeParams: true });

router.get(
  '/checkout-session/:pricingID',
  // authController.protect,
  protect,
  // pricingController.getCheckoutSession,
  getCheckoutSession,
);

router.get(
  '/',
  // authController.protect,
  // pricingController.getPricings,
  getPricings,
);

module.exports = router;
