const User = require('../../models/userModel');
const Pricing = require('../../models/pricingModel');
const Subscription = require('../../models/subscriptionModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const sendMail = require('../../utils/email');

const signup = catchAsync(async (req, res, next) => {
  try {
    // Step 1: Create the new user first, without the subscription
    const newUser = await User.create(req.body);

    if (!newUser) return next(new AppError('User creation failed', 404));

    console.log(`NEW USER CREATED:`, newUser);

    // Step 2: Now, fetch the pricing information
    const newUserPricing = await Pricing.findOne({
      name: 'signup',
      active: true,
    });

    if (!newUserPricing)
      return next(new AppError('Default PRICING not found', 404));

    console.log(`SIGNUP pricing:`, newUserPricing);

    // Step 3: Create the subscription using the newly created user's ID
    const newSubscription = await Subscription.create({
      user: newUser._id, // Now we have the user ID
      pricingName: 'signup',
      pricings: newUserPricing._id, // Link the pricing object
      status: 'active',
      autoRenew: true,
      price: 0,
    });

    console.log(`NEW SUBSCRIPTION CREATED:`, newSubscription);

    // Step 4: Update the user with the new subscription IDs
    newUser.subscriptions.push(newSubscription._id); // Add subscription to subscriptions array
    newUser.currentActiveSubscription = newSubscription._id; // Set current active subscription

    await newUser.save(); // Save the updated user with the new subscription

    console.log(`NEW USER AFTER ALL THE CHANGES`, newUser);

    // Step 5: Proceed with the rest of your flow
    req.newUser = newUser;
    next();
  } catch (err) {
    console.log(err, err.message);
  }
});

const signupAuth = catchAsync(async (req, res, next) => {
  console.log(`SIGN UP AUTHENTICATION BEGINS HERE`);

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
