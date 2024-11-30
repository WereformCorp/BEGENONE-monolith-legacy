const express = require('express');
const subscriptionController = require('../controllers/subscriptionController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
  '/checkout-session/:subscriptionID',
  authController.protect,
  subscriptionController.getCheckoutSession,
);

module.exports = router;
