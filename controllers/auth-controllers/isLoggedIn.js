/**
 * @fileoverview Non-blocking authentication check for view routes
 * @module controllers/auth-controllers/isLoggedIn
 * @layer Middleware
 *
 * @description
 * Inspects the `jwt` cookie to determine whether a valid, authenticated user
 * session exists. Unlike the protect middleware, this does not reject
 * unauthenticated requests; it silently calls next() so views can conditionally
 * render authenticated content via `res.locals.user`.
 *
 * @dependencies
 * - Upstream: View/template routes that optionally display user-specific content
 * - Downstream: jsonwebtoken, User model, catchAsync
 */
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');

const isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // Verifies the token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      // 2) Check if User still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if User changed password after the Token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.user = currentUser;
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
});

module.exports = isLoggedIn;
