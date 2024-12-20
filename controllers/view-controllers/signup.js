const catchAsync = require('../../utils/catchAsync');

const signup = catchAsync(async (req, res, next) => {
  try {
    if (res.locals.user) {
      // If the user is logged in, redirect to the main page
      return res.redirect('/');
    }
    res.status(200).render('../views/main/signup', {
      title: `Sign Up | BEGENONE`,
      // showAds: res.locals.showAds || null,
    });
  } catch (err) {
    console.log(`SIGN UP | VIEWS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = signup;
