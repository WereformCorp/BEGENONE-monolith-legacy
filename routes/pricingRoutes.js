/**
 * @fileoverview Pricing plan retrieval and Stripe checkout session route definitions.
 * @module routes/pricingRoutes
 * @layer Route
 * @basepath /api/v1/pricings
 *
 * @description
 * Registers a public endpoint for listing available pricing tiers and a protected
 * endpoint for initiating a Stripe checkout session by pricing plan ID.
 *
 * Middleware chain: protect guards the checkout-session endpoint; the pricing
 * listing endpoint is publicly accessible.
 *
 * @dependencies
 * - Upstream: app.js (mounted at /api/v1/pricings)
 * - Downstream: controllers/pricing-controllers/getPricing, controllers/pricing-controllers/getCheckoutSession, controllers/auth-controllers/protect
 *
 * @security
 * Checkout session creation requires authenticated access via the protect middleware.
 */

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
