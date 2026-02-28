/**
 * @fileoverview Signup page view renderer
 * @module controllers/view-controllers/signup
 * @layer Controller (View)
 *
 * @description
 * Renders the signup page template. Redirects authenticated users to the home page.
 *
 * @dependencies
 * - Upstream: view route handler
 * - Downstream: catchAsync
 */
const catchAsync = require('../../utils/catchAsync');

const signup = catchAsync(async (req, res, next) => {
  try {
    if (res.locals.user) {
      // If the user is logged in, redirect to the main page
      return res.redirect('/');
    }
    res.status(200).render('../views/main/signup', {
      title: `Sign Up | BEGENONE`,
      showAds: res.locals.showAds,
    });
  } catch (err) {
    console.log(`SIGN UP | VIEWS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = signup;
