/**
 * @fileoverview Self-service profile update controller
 * @module controllers/user-controllers/updateMe
 * @layer Controller
 *
 * @description
 * Allows the authenticated user to update their own non-sensitive profile
 * fields. Explicitly rejects attempts to change password, passwordConfirm,
 * or phoneNumber through this route. Supports optional file upload for the
 * user photo when req.file is present.
 *
 * @dependencies
 * - Upstream: User route (PATCH /updateMe), requires protect middleware
 * - Downstream: User model, catchAsync, AppError
 *
 * @security Blocks password and sensitive field updates; enforces dedicated password change route.
 */
const User = require('../../models/userModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

/**
 * Updates the authenticated user's profile, rejecting sensitive field changes.
 * @param {Object} req - Express request; expects req.user._id and non-sensitive fields in req.body
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 * @returns {void}
 * @throws {AppError} 400 if request body contains password or other sensitive fields
 */
const updateMe = catchAsync(async (req, res, next) => {
  try {
    // 1) Create error if user posts password data
    const sensitiveFields = ['password', 'passwordConfirm', 'phoneNumber'];
    const hasSensitiveField = sensitiveFields.some(
      (field) => req.body.eAddress && req.body.eAddress[field] !== undefined,
    );

    if (hasSensitiveField) {
      return next(
        new AppError(
          `This route is not for password updates. Please use /updateMyPassword`,
          400,
        ),
      );
    }

    const me = await User.findById(req.user._id);
    const userData = { ...req.body };

    // userData = me;
    // console.log(me);

    // 3) Update User document
    let updatedUser = await User.findByIdAndUpdate(req.user._id, userData, {
      new: true,
    });

    if (req.file) {
      updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { photo: req.file.filename },
        { new: true },
      );
    }
    // console.log(updatedUser.photo);

    return res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    console.log(`UPDATE ME | USER CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = updateMe;
