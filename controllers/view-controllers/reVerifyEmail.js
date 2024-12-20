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
