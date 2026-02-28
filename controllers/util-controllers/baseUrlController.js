/**
 * @fileoverview Environment-aware base URL resolution controller
 * @module controllers/util-controllers/baseUrlController
 * @layer Controller
 *
 * @description
 * Returns the application's base URL as a JSON response, selecting between
 * the production domain and the localhost development URL based on the
 * NODE_ENV environment variable. Sets a permissive CORS header to allow
 * cross-origin access from any domain.
 *
 * @dependencies
 * - Upstream: Utility route (GET /baseUrl)
 * - Downstream: catchAsync
 */
/* eslint-disable */
const catchAsync = require('../../utils/catchAsync');
const getBaseUrl = catchAsync((req, res) => {
  try {
    // Enable CORS for all domains
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allows all domains to access

    if (process.env.NODE_ENV === 'production') {
      // Use the incoming request's origin (any domain)
      return res.json({
        status: 'success',
        url: `https://begenone.com`,
      });
    } else if (process.env.NODE_ENV === 'development') {
      // Use localhost for development
      return res.json({
        status: 'success',
        url: `http://127.0.0.1:3000`,
      });
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid environment',
      });
    }
  } catch (err) {
    console.log(`BASE URL | UTIL CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = getBaseUrl;
