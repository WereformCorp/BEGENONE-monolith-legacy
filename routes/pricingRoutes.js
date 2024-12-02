const express = require('express');
const pricingController = require('../controllers/pricingController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.get(
  '/checkout-session/:pricingID',
  authController.protect,
  pricingController.getCheckoutSession,
);

router.get(
  '/',
  // authController.protect,
  pricingController.getPricings,
);

module.exports = router;
