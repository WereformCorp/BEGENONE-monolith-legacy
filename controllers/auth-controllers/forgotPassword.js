/**
 * @fileoverview Password reset token generation and email dispatch
 * @module controllers/auth-controllers/forgotPassword
 * @layer Controller
 *
 * @description
 * Accepts an email address, locates the corresponding user, generates a
 * cryptographic password-reset token via the User model method, persists the
 * hashed token with an expiry, and emails the plaintext reset URL to the user.
 * On email failure, the stored token fields are cleared to prevent stale tokens.
 *
 * @dependencies
 * - Upstream: Auth route (POST /forgotPassword)
 * - Downstream: User model, sendMail, catchAsync, AppError
 *
 * @sideeffect Mutates User document (passwordResetToken, passwordResetExpires); sends email.
 */
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const sendMail = require('../../utils/email');

/**
 * Generates a password-reset token for the user matching the supplied email
 * and dispatches the reset URL via email. Rolls back token fields on mail failure.
 * @param {Object} req - Express request; expects req.body.eAddress.email
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 * @returns {void}
 * @throws {AppError} 404 if no user matches the provided email
 * @sideeffect Persists reset token on User document; sends email
 */
const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get User based on Posted EMAIL
  const user = await User.findOne({
    'eAddress.email': req.body.eAddress.email,
  });
  // console.log(user);

  if (!user) {
    return next(new AppError(`There is no user with that email address.`, 404));
  }

  // 2) Generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Send a PATCH request to: ${resetURL}`;

  try {
    await sendMail({
      email: user.eAddress.email,
      subject: `Your Password Reset Token (Valid for 10 minutes)`,
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token send to email!',
    });
  } catch (err) {
    user.eAddress.passwordResetToken = undefined;
    user.eAddress.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(`There was an error sending the email. Try again later!`),
    );
  }
});

module.exports = forgotPassword;
