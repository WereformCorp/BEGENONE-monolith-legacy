const catchAsync = require('../../utils/catchAsync');

const login = catchAsync(async (req, res, next) => {
  try {
    if (res.locals.user) {
      // If the user is logged in, redirect to the main page
      return res.redirect('/');
    }

    res
      .status(200)
      .set(
        'Content-Security-Policy',
        "script-src 'self' https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.2/axios.min.js 'unsafe-inline' 'unsafe-eval';",
      )
      .render('../views/main/login', {
        title: `Log In | BEGENONE`,
        showAds: res.locals.showAds,
      });
  } catch (err) {
    console.log(`LOGIN | VIEWS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = login;
