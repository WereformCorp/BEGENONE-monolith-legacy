const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const { createSendToken } = require('./createSignToken');

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
