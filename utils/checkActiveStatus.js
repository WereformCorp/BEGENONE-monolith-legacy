/**
 * @fileoverview Middleware to enforce user account activation status
 * @module utils/checkActiveStatus
 * @layer Middleware
 *
 * @description
 * Inspects the current user object on res.locals and redirects to the
 * re-verification page if the account is flagged as inactive. Allows
 * the request to proceed to downstream handlers if no user is present
 * or the user is active.
 *
 * @dependencies
 * - Upstream: Route definitions that require verified user accounts
 * - Downstream: /re-verify view route (redirect target)
 *
 * @security
 * Prevents inactive (unverified) users from accessing protected resources
 * by enforcing a server-side redirect before any controller logic executes.
 */
module.exports = async (req, res, next) => {
  const { user } = res.locals;
  if (user)
    if (!user.active || user.active === false)
      return res.redirect('/re-verify');

  next(); // If the user is active, proceed to the next middleware or route handler
};
