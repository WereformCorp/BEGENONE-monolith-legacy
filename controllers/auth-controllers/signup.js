const User = require('../../models/userModel');
const Pricing = require('../../models/pricingModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const sendMail = require('../../utils/email');

const signup = catchAsync(async (req, res, next) => {
  try {
    const basicPricing = await Pricing.findOne({
      name: 'basic',
      active: true,
    });

    console.log(`BASIC pricing:`, basicPricing);

    if (!basicPricing)
      return next(new AppError('Default PRICING not found', 404));

    // Add the basic subscription to the user data
    const userData = {
      ...req.body,
      subscriptions: basicPricing, // Embed the queried subscription in the User document
    };

    console.log(`USER DATA FROM SIGN UP:`, userData);

    const newUser = await User.create(userData);

    console.log(`NEW USER FROM SIGNUP:`, newUser);

    await newUser.save();

    if (!newUser) return next(new AppError(`Data Not Found!`, 404));
    // createSendToken(newUser, 201, res);
    req.newUser = newUser;
    next();
  } catch (err) {
    console.log(err, err.message);
  }
});

const signupAuth = catchAsync(async (req, res, next) => {
  // 1) Get User based on Posted EMAIL
  const { newUser } = req;
  // console.log(`NEW USER:`, newUser);

  if (!newUser) return next(new AppError(`Data Not Found!`, 404));

  // 2) Generate random reset token
  // console.log(`IS THE CODE REACHING HERE?`);
  const signupToken = await newUser.createSignupAuthToken();
  await newUser.save({ validateBeforeSave: true });
  // console.log(`SIGN UP TOKEN:`, signupToken);

  // 3) Send it to user's email
  const authURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/verifyEmail/${signupToken}`;

  const message = `Please confirm your email here: ${authURL}`;

  try {
    await sendMail({
      email: req.newUser.eAddress.email,
      subject: `Your Sign Up Authentication Email (Valid for 10 minutes)`,
      message,
    });

    return res.status(200).json({
      status: 'success',
      message: 'Token send to email!',
    });
  } catch (err) {
    console.log(`SIGNUP | AUTH CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = {
  signup,
  signupAuth,
};
