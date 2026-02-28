/**
 * @fileoverview User login controller
 * @module controllers/auth-controllers/login
 * @layer Controller
 *
 * @description
 * Validates user-supplied email and password credentials against stored records.
 * On successful authentication, delegates JWT creation and cookie attachment to
 * createSendToken. Returns 401 on credential mismatch without revealing which
 * field was incorrect.
 *
 * @dependencies
 * - Upstream: Auth route (POST /login)
 * - Downstream: User model, createSendToken, catchAsync, AppError
 *
 * @security Credential verification uses bcrypt comparison via User.correctPassword.
 */
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const { createSendToken } = require('./createSignToken');

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body.eAddress;

  // console.log(`EMAIL: `, email);
  // console.log(`PASSWORD: `, password);

  // 1) Check if the email and password exist
  if (!email || !password) {
    return next(new AppError(`Please provide email and password`, 400));
  }

  // 2) Check if the user exists and password is correct
  const user = await User.findOne({ 'eAddress.email': email }).select(
    '+eAddress.password eAddress.email',
  );

  // console.log(`USER FROM LOGIN`, user);

  if (!user) {
    return next(new AppError(`Incorrect Email or Password.`, 401));
  }

  const isPasswordCorrect = await user.correctPassword(
    password,
    user.eAddress.password,
  );

  // console.log(`IS PASSWORD CORRECT?`, isPasswordCorrect);

  if (!isPasswordCorrect) {
    return next(new AppError('Incorrect Email or Password.', 401));
  }

  // 3) If everything is ok, send token to the client.
  createSendToken(user, 200, res);
});

module.exports = login;
