const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const { createSendToken } = require('./createSignToken');

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
