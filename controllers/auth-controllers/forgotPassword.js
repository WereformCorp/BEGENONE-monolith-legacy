const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const sendMail = require('../../utils/email');

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
