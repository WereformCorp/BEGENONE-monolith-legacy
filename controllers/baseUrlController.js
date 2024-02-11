/* eslint-disable */
exports.getBaseUrl = (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    // Use the production domain
    return res.json({
      status: 'success',
      url: 'https://begenuine.wereform.com.au',
    });
  } else if (process.env.NODE_ENV === 'development') {
    // Use the req object for development
    return res.json({
      status: 'success',
      url: `http://127.0.0.1:3000`,
    });
  }
};
