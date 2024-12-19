const express = require('express');
// const pricingController = require('../controllers/pricingController');
// const authController = require('../controllers/authController');

// eslint-disable-next-line import/no-extraneous-dependencies
// const { body, validationResult } = require('express-validator');

// const {
//   validatePricingID,
//   checkValidationErrors,
// } = require('../controllers/util-controllers/validator');

const getPricings = require('../controllers/pricing-controllers/getPricing');
const getCheckoutSession = require('../controllers/pricing-controllers/getCheckoutSession');
const protect = require('../controllers/auth-controllers/protect');

// console.log(`PROTECT:`, protect);

const router = express.Router({ mergeParams: true });

router.get(
  '/checkout-session/:pricingID',
  // validatePricingID(),
  // checkValidationErrors,
  protect,
  getCheckoutSession,
  // authController.protect,
  // pricingController.getCheckoutSession,
);

router.get(
  '/',
  // authController.protect,
  // pricingController.getPricings,
  getPricings,
);

module.exports = router;
