/**
 * @fileoverview Authentication gate middleware
 * @module controllers/util-controllers/authMiddleware
 * @layer Middleware
 *
 * @description
 * Lightweight guard that verifies req.user has been populated by an upstream
 * authentication middleware (e.g., protect). Returns 401 if the user object
 * is absent, otherwise passes control to the next handler.
 *
 * @dependencies
 * - Upstream: Routes that require a confirmed authenticated user after protect middleware
 * - Downstream: None
 *
 * @security Rejects unauthenticated requests with HTTP 401.
 */
const authMiddleware = (req, res, next) => {
  if (!req.user) {
    // console.log('User is not authenticated');
    return res.status(401).send('User not authenticated');
  }

  // const userChannel = req.user.channel;
  // console.log(`GETTING THE USER CHANNEL:`, userChannel);
  next();
};

module.exports = authMiddleware;
