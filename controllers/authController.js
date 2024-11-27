const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendMail = require('../utils/email');

// eslint-disable-next-line arrow-body-style
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
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
};

exports.signup = catchAsync(async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    if (!newUser) return next(new AppError(`Data Not Found!`, 404));
    // createSendToken(newUser, 201, res);
    req.newUser = newUser;
    next();
  } catch (err) {
    console.log(err, err.message);
  }
});

exports.signupAuth = catchAsync(async (req, res, next) => {
  // 1) Get User based on Posted EMAIL
  const { newUser } = req;
  console.log(`NEW USER:`, newUser);

  if (!newUser) return next(new AppError(`Data Not Found!`, 404));

  // 2) Generate random reset token
  console.log(`IS THE CODE REACHING HERE?`);
  const signupToken = await newUser.createSignupAuthToken();
  await newUser.save({ validateBeforeSave: true });
  console.log(`SIGN UP TOKEN:`, signupToken);

  // 3) Send it to user's email
  const authURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/verifyEmail/${signupToken}`;

  const message = `Please confirm your email here: ${authURL}`;

  try {
    // if (authURL)

    await sendMail({
      email: req.newUser.eAddress.email,
      subject: `Your Sign Up Authentication Email (Valid for 10 minutes)`,
      message,
    });

    // res.redirect('/email-confirmation');

    return res.status(200).json({
      status: 'success',
      message: 'Token send to email!',
      data: {
        //   userFirstName: newUser.name.firstName,
        //   userSecondName: newUser.name.secondName,
        //   userEmail: newUser.eAddress.email,
        //   userPassword: newUser.eAddress.password,
        //   userPasswordConfirm: newUser.eAddress.passwordConfirm,
        //   username: newUser.username,
      },
    });
  } catch (err) {
    console.log(`ERROR Signup Auth: `, err);
    return res.json({
      message: `There is an error sending the email`,
      error: err,
    });
  }
});

exports.verifySignupToken = catchAsync(async (req, res, next) => {
  // 1) Hash the token provided in URL to compare with the stored hashed token
  console.log(`HAS THE CODE REACHED TILL HERE?`);

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  console.log(`HASHED TOKEN:`, hashedToken);

  // // 2) Find user with matching signup token and ensure token hasn’t expired
  // const user = await User.findOne({
  //   'eAddress.signupAuthToken': hashedToken,
  //   'eAddress.signupAuthTokenExpiresIn': { $gt: Date.now() },
  // });

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

  console.log('User found:', user);

  // 3) Activate user’s account
  user.active = true;
  user.eAddress.signupAuthToken = undefined;
  user.eAddress.signupAuthTokenExpiresIn = undefined;
  await user.save();
  console.log('User account activated and token cleared.');

  // 4) Log the user in (or simply return success if that’s not desired)
  createSendToken(user, 200, res);

  // res.redirect('/');
});

exports.resendVerificationLink = catchAsync(async (req, res, next) => {
  // Assuming req.user contains authenticated user data, fetched via a middleware
  const { user } = res.locals;
  console.log(`156 LINE USER:`, user);

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

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body.eAddress;

  // 1) Check if the email and password exist
  if (!email || !password) {
    return next(new AppError(`Please provide email and password`, 400));
  }

  // 2) Check if the user exists and password is correct
  const user = await User.findOne({ 'eAddress.email': email }).select(
    '+eAddress.password',
  );

  if (
    !user ||
    !(await user.correctPassword(password, user.eAddress.password))
  ) {
    return next(new AppError(`Incorrect Email or Password.`, 401));
  }

  // 3) If everything is ok, send token to the client.
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) GETTING TOKEN AND CHECK OF IT'S THERE
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError(`You are not logged in. Please log in to get access`, 401),
    );
  }

  // console.log('Token:', token);
  // 2) VERIFICATION TOKEN
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // console.log(decoded);
  // 3) CHECK IF USER STILL EXISTS
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        `The User belonging to this token does no longer exists.`,
        401,
      ),
    );
  }

  // 4) CHECK IF USER CHANGE PASSWORD AFTER THE TOKEN wAS ISSUED
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    // IF TRUE THEN AppError()
    return next(
      new AppError(`User recently changed password! Please log in again.`, 401),
    );
  } // "iat" here means Issued At or Issues At or whatever

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// eslint-disable-next-line arrow-body-style
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`You do not have permission to perform this action.`, 403),
      );
    }

    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
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
};
exports.resetPassword = async (req, res, next) => {
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
};

exports.updatePassword = catchAsync(async (req, res, next) => {
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
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // Verifies the token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      // 2) Check if User still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if User changed password after the Token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.user = currentUser;
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({ status: 'success' });
};
