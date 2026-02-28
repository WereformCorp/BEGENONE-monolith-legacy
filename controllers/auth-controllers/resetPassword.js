/**
 * @fileoverview Password reset execution controller
 * @module controllers/auth-controllers/resetPassword
 * @layer Controller
 *
 * @description
 * Accepts a plaintext reset token from the URL, hashes it with SHA-256, and
 * locates the user whose stored hashed token matches and has not expired.
 * On match, updates the user's password fields, clears the reset token, saves
 * the document (triggering pre-save hooks), and issues a fresh JWT.
 *
 * @dependencies
 * - Upstream: Auth route (PATCH /resetPassword/:token)
 * - Downstream: crypto, User model, createSendToken, catchAsync, AppError
 *
 * @security Token verified via SHA-256 hash comparison with time-bound expiry check.
 */
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const { createSendToken } = require('./createSignToken');

/**
 * Verifies the password-reset token and updates the user's password.
 * @param {Object} req - Express request; expects req.params.token and req.body.eAddress.password
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 * @returns {void}
 * @throws {AppError} 400 if token is invalid or expired
 */
const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get User Based on The Token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    'eAddress.passwordResetToken': hashedToken,
    'eAddress.passwordResetExpires': { $gt: Date.now() },
  });
  // 2) If the token has not expired and there is user, set the new password
  if (!user) {
    return next(new AppError(`Token is invalid or has expired`, 400));
  }

  user.eAddress.password = req.body.eAddress.password;
  user.eAddress.passwordConfirm = req.body.eAddress.passwordConfirm;
  user.eAddress.passwordResetToken = undefined;
  user.eAddress.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user

  // 4) Log the user in, send the JWT
  createSendToken(user, 200, res);
});

module.exports = resetPassword;
