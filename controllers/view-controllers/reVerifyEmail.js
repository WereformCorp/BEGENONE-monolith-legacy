/**
 * @fileoverview Email re-verification page view renderer
 * @module controllers/view-controllers/reVerifyEmail
 * @layer Controller (View)
 *
 * @description
 * Renders the email re-verification page where users can request a new
 * verification email.
 *
 * @dependencies
 * - Upstream: view route handler
 * - Downstream: catchAsync
 */
const catchAsync = require('../../utils/catchAsync');

const reVerifyEmail = catchAsync(async (req, res, next) => {
  try {
    res.status(200).render('../views/main/reVerify.pug', {
      status: 'success',
      message: 'Congradulations! You are now verified',
      showAds: res.locals.showAds,
    });
  } catch (err) {
    console.log(`RE-VERIFY EMAIL | VIEWS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = reVerifyEmail;
