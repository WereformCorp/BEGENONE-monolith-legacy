const User = require('../../models/userModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

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
    console.log(me);

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
    console.log(updatedUser.photo);

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
