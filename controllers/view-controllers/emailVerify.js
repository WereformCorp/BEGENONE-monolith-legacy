const axios = require('axios');
const catchAsync = require('../../utils/catchAsync');
const { urlPath } = require('../util-controllers/urlPath-TimeController');

const emailVerifyPage = catchAsync(async (req, res, next) => {
  try {
    const verifyEmail = await axios.patch(
      `${urlPath}/api/v1/users/verifyEmail/${req.params.token}`,
    );

    console.log(`VERIFIED EMAIL DATA`, verifyEmail.data);
    res.status(200).render('../views/main/verifyEmail.pug', {
      status: 'success',
      message: 'Congradulations! You are now verified',
      // showAds: res.locals.showAds || null,
    });
  } catch (err) {
    console.log(`EMAIL VERIFY | VIEWS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = emailVerifyPage;
