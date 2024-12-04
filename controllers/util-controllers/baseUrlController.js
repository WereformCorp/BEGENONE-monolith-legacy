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
