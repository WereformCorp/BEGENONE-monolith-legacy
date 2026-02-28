/**
 * @fileoverview Authenticated password change controller
 * @module controllers/auth-controllers/updatePassword
 * @layer Controller
 *
 * @description
 * Allows an already-authenticated user to change their password by first
 * re-verifying the current password. On successful verification, updates the
 * password fields and triggers a new JWT issuance so the session remains valid
 * after the credential change.
 *
 * @dependencies
 * - Upstream: Auth route (PATCH /updateMyPassword), requires protect middleware
 * - Downstream: User model, createSendToken, catchAsync, AppError
 *
 * @security Re-authenticates current password before allowing change; invalidates old JWT via new token issuance.
 */
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const { createSendToken } = require('./createSignToken');

/**
 * Re-verifies the user's current password, then updates to the new password and reissues a JWT.
 * @param {Object} req - Express request; expects req.user.id and req.body.eAddress password fields
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 * @returns {void}
 * @throws {AppError} 401 if current password verification fails
 */
const updatePassword = catchAsync(async (req, res, next) => {
  try {
    // 1) Get User from Collection
    const user = await User.findById(req.user.id).select('+eAddress.password');

    // 2) Check if Posted Password is Correct
    if (
      !(await user.correctPassword(
        req.body.eAddress.passwordCurrent,
        user.eAddress.password,
      ))
    ) {
      return next(new AppError(`Your current password is wrong.`, 401));
    }

    // 3) If so, Update The Password
    user.eAddress.password = req.body.eAddress.password;
    user.eAddress.passwordConfirm = req.body.eAddress.passwordConfirm;
    await user.save();
    // User.findbyIdandUpdate will NOT work as intended!

    // 4) Log User In, Send JWT
    createSendToken(user, 200, res);
  } catch (err) {
    console.log(`UPDATE PASSWORD | AUTH CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = updatePassword;
