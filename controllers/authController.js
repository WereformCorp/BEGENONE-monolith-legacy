const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

// eslint-disable-next-line arrow-body-style
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  // const cookieOptions = {
  //   expires: new Date(
  //     Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * (24 * 60 * 60 * 1000),
  //   ),

  //   httpOnly: true,
  // };
  // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  // res.cookie();
  // res.cookie('jwt', token, cookieOptions);

  // // Remove Password in Output
  // user.password = undefined;

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
    const newUser = await User.create({
      name: {
        firstName: req.body.name.firstName,
        secondName: req.body.name.secondName,
      },
      displayImage: req.body.displayImage,
      username: req.body.username,
      displayName: req.body.displayName,
      role: req.body.role,
      eAddress: {
        phoneNumber: req.body.eAddress.phoneNumber,
        email: req.body.eAddress.email,
        password: req.body.eAddress.password,
        passwordConfirm: req.body.eAddress.passwordConfirm,
        passwordChangedAt: req.body.eAddress.passwordChangedAt,
        passwordResetToken: req.body.eAddress.passwordResetToken,
      },
      lockAccount: {
        numeric: req.body.lockAccount.numeric,
        alphabetic: req.body.lockAccount.alphabetic,
      },
      platformSettings: {
        mode: req.body.platformSettings.mode,
        languages: req.body.platformSettings.languages,
        gui: req.body.platformSettings.gui,
        ux: {
          scroll: req.body.platformSettings.ux.scroll,
          popUp: req.body.platformSettings.ux.popUp,
          cookies: req.body.platformSettings.ux.cookies,
        },
      },
    });

    if (!newUser) return next(new AppError(`Data Not Found!`, 404));

    createSendToken(newUser, 201, res);
  } catch (err) {
    console.log(err, err.message);
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body.eAddress;

  console.log(`EMAIL: ${email}`, `PASSWORD: ${password}`);

  // 1) Check if the email and password exist
  if (!email || !password) {
    return next(new AppError(`Please provide email and password`, 400));
  }

  // 2) Check if the user exists and password is correct
  const user = await User.findOne({ 'eAddress.email': email }).select(
    '+eAddress.password',
  );
  // const correct = await user.correctPassword(password, user.eAddress.password);

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
  }

  console.log(token);

  if (!token) {
    return next(
      new AppError(`You are not logged in. Please log in to get access`, 401),
    );
  }
  // 2) VERIFICATION TOKEN
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

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
    await sendEmail({
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
