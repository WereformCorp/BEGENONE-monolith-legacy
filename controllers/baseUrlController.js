// /* eslint-disable */
// exports.getBaseUrl = (req, res) => {
//   if (process.env.NODE_ENV === 'production') {
//     // Use the production domain
//     return res.json({
//       status: 'success',
//       url: process.env.BASE_URL,
//     });
//   } else if (process.env.NODE_ENV === 'development') {
//     // Use the req object for development
//     return res.json({
//       status: 'success',
//       url: `http://localhost:80`,
//     });
//   }
// };

/* eslint-disable */
exports.getBaseUrl = (req, res) => {
  // Enable CORS for all domains
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allows all domains to access

  if (process.env.NODE_ENV === 'production') {
    // Use the incoming request's origin (any domain)
    return res.json({
      status: 'success',
      url: `https://${req.get('host')}`,
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
};
