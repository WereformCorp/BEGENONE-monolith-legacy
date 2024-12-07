const crypto = require('crypto');

const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const { createSendToken } = require('./createSignToken');
const sendMail = require('../../utils/email');

const verifySignupToken = catchAsync(async (req, res, next) => {
  // 1) Hash the token provided in URL to compare with the stored hashed token
  // console.log(`HAS THE CODE REACHED TILL HERE?`);

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // console.log(`HASHED TOKEN:`, hashedToken);

  // Check for the signup token
  const user = await User.findOne({
    $or: [
      {
        'eAddress.signupAuthToken': hashedToken,
        'eAddress.signupAuthTokenExpiresIn': { $gt: Date.now() },
      },
      {
        'eAddress.resendAuthToken': hashedToken,
        'eAddress.resendAuthTokenExpiresIn': { $gt: Date.now() },
      },
    ],
  });

  if (!user) {
    console.log('No matching user or token expired.');
    return next(new AppError('Token is invalid or has expired', 400));
  }

  // console.log('User found:', user);

  // 3) Activate user’s account
  user.active = true;
  user.eAddress.signupAuthToken = undefined;
  user.eAddress.signupAuthTokenExpiresIn = undefined;
  await user.save();
  // console.log('User account activated and token cleared.');

  // 4) Log the user in (or simply return success if that’s not desired)
  createSendToken(user, 200, res);

  // res.redirect('/');
});

const resendVerificationLink = catchAsync(async (req, res, next) => {
  // Assuming req.user contains authenticated user data, fetched via a middleware
  const { user } = res.locals;
  // console.log(`156 LINE USER:`, user);

  // 1) Check if the user is already active
  if (user.active) {
    return res.status(400).json({
      status: 'fail',
      message: 'User is already verified.',
    });
  }

  if (!user) return next(new AppError('User not found!', 404));

  // 1) If cooldown has expired, reset attempts and cooldown
  if (user.resendCooldownExpires && user.resendCooldownExpires <= Date.now()) {
    user.resendAttempts = 0; // Reset attempts after cooldown expires
    user.resendCooldownExpires = undefined; // Clear cooldown
  }

  // 2) If attempts have reached 3, block further resends and trigger cooldown
  if (user.resendAttempts >= 3) {
    if (!user.resendCooldownExpires) {
      // Set cooldown for 1 hour
      user.resendCooldownExpires = Date.now() + 60 * 60 * 1000; // 1-hour cooldown
      await user.save();
    }

    const remainingTime = Math.ceil(
      (user.resendCooldownExpires - Date.now()) / 1000 / 60,
    );
    return next(
      new AppError(
        `You have exceeded the resend limit. Please wait ${remainingTime} minutes before trying again.`,
        429,
      ),
    );
  }

  // 2) Generate a new signup token and set expiration
  const signupToken = user.createSignupAuthToken();
  user.eAddress.resendAuthToken = signupToken;
  user.eAddress.signupAuthTokenExpiresIn = Date.now() + 7 * 24 * 60 * 60 * 1000; // 10 minutes expiration
  await user.save({ validateBeforeSave: true });

  console.log(`SIGN UP TOKEN FROM RE-VERIFICATION:`, signupToken);
  console.log(`USER FROM RE-VERIFICATION:`, user);

  // 3) Construct verification URL
  const authURL = `${req.protocol}://${req.get('host')}/api/v1/users/verifyEmail/${signupToken}`;

  // 4) Send verification email
  const message = `Please confirm your email here: ${authURL}`;

  try {
    await sendMail({
      email: user.eAddress.email,
      subject: 'Email Verification Required (Valid for 10 minutes)',
      message,
    });

    user.resendAttempts += 1;
    await user.save();

    // Redirect or respond with success message
    return res.status(200).json({
      status: 'success',
      message: 'Verification link resent to email!',
    });
  } catch (err) {
    console.error(`Error in resending verification link: `, err);
    return next(
      new AppError(
        'Error sending the verification email. Try again later!',
        500,
      ),
    );
  }
});

module.exports = {
  verifySignupToken,
  resendVerificationLink,
};
