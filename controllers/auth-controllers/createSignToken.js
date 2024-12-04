const jwt = require('jsonwebtoken');

// eslint-disable-next-line arrow-body-style
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  try {
    const token = signToken(user._id);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * (24 * 60 * 60 * 1000),
      ),

      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    };
    if (process.env.NODE_ENV === 'production') {
      cookieOptions.httpOnly = false;
      cookieOptions.secure = true;
    }
    res.cookie('jwt', token, cookieOptions);

    // Remove Password in Output
    // user.eAddress.password = undefined;
    user.eAddress.passwordConfirm = undefined;

    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    console.log(`CREATE SIGN TOKEN | AUTH CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
};

module.exports = { createSendToken };
