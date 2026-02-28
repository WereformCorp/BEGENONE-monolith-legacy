/**
 * @fileoverview Higher-order function for async Express route handler error forwarding
 * @module utils/catchAsync
 * @layer Utility
 *
 * @description
 * Wraps an async Express route handler and catches any rejected promise, forwarding
 * the error to Express's next() function. Eliminates the need for repetitive
 * try-catch blocks in every async controller method.
 *
 * @dependencies
 * - Upstream: All async controller/route handlers
 * - Downstream: Express error-handling middleware (via next)
 */

/**
 * @param {Function} fn - Async Express route handler (req, res, next) => Promise
 * @returns {Function} Express-compatible middleware that catches async rejections
 */
// eslint-disable-next-line arrow-body-style
const catchAsync = (fn) => (req, res, next) => {
  return fn(req, res, next).catch(next);
};

module.exports = catchAsync;
