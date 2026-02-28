/**
 * @fileoverview Pre-registration uniqueness validation controller
 * @module controllers/util-controllers/checkEmailUsernameExistence
 * @layer Controller
 *
 * @description
 * Checks whether a given username or email address is already registered
 * in the system before the user completes the full signup form. Returns a
 * descriptive status indicating which field, if any, conflicts with an
 * existing record.
 *
 * @dependencies
 * - Upstream: Pre-registration route (POST /checkExistence)
 * - Downstream: User model, catchAsync
 */
const User = require('../../models/userModel'); // Adjust the path as needed
const catchAsync = require('../../utils/catchAsync'); // Adjust the path as needed

// Endpoint to check if username or email exists
const checkEmailUsernameExistense = catchAsync(async (req, res) => {
  const { username, email } = req.body;

  console.log('Checking existence of:', username, email);

  try {
    // Check if the username exists
    const usernameExists = await User.findOne({ username });
    console.log('Username exists:', usernameExists);

    if (usernameExists)
      return res.json({ status: 'fail', message: 'username-exist' });

    // Check if the email exists
    const emailExists = await User.findOne({ 'eAddress.email': email });
    console.log('Email exists:', emailExists);
    if (emailExists)
      return res.json({ status: 'fail', message: 'email-exist' });

    // If neither exist, return success
    return res
      .status(200)
      .json({ message: 'Username and email are available' });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Error checking existence', error: err.message });
  }
});

module.exports = checkEmailUsernameExistense;
