const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getCheckoutSession = (req, res, next) => {
  // 1) Get the Currectly Selected Subscription
  // 2) Create a Checkout Session
  // 3) Create Session as Response
};
