/**
 * @fileoverview Email sent confirmation page view renderer
 * @module controllers/view-controllers/emailSentPage
 * @layer Controller (View)
 *
 * @description
 * Renders the confirmation page displayed after a verification email has been
 * sent to the user's email address.
 *
 * @dependencies
 * - Upstream: view route handler
 * - Downstream: catchAsync
 */
const catchAsync = require('../../utils/catchAsync');

const emailSentPage = catchAsync(async (req, res, next) => {
  try {
    res.status(200).render('../views/main/emailSentPage.pug', {
      status: 'success',
      message:
        'Verification Email has been sent to your email account, please verify to continue.',
      showAds: res.locals.showAds,
    });
  } catch (err) {
    console.log(`EMAIL SEND PAGE | VIEWS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = emailSentPage;
