/**
 * @fileoverview User logout controller
 * @module controllers/auth-controllers/logout
 * @layer Controller
 *
 * @description
 * Clears the authenticated session by overwriting the `jwt` cookie with a
 * short-lived dummy value, effectively invalidating the client-side token.
 *
 * @dependencies
 * - Upstream: Auth route (GET /logout)
 * - Downstream: None (pure Express response)
 *
 * @security Overwrites JWT cookie; sets Secure flag in production.
 */
const logout = (req, res) => {
  try {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({ status: 'success' });
  } catch (err) {
    console.log(`LOGOUT | AUTH CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
};

module.exports = logout;
