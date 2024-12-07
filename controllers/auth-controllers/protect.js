const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

const protect = catchAsync(async (req, res, next) => {
  try {
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
        new AppError(
          `User recently changed password! Please log in again.`,
          401,
        ),
      );
    } // "iat" here means Issued At or Issues At or whatever

    // console.log(`CURRENT USER:`, currentUser);
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (err) {
    console.log(`PROTECT | AUTH CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = protect;
