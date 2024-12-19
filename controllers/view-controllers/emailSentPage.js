const catchAsync = require('../../utils/catchAsync');

const emailSentPage = catchAsync(async (req, res, next) => {
  try {
    res.status(200).render('../views/main/emailSentPage.pug', {
      status: 'success',
      message:
        'Verification Email has been sent to your email account, please verify to continue.',
      showAds: res.locals.showAds || null,
    });
  } catch (err) {
    console.log(`EMAIL SEND PAGE | VIEWS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = emailSentPage;
