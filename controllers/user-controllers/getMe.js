const User = require('../../models/userModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

const me = catchAsync(async (req, res, next) => {
  try {
    const getMe = await User.findById(req.user._id).select(
      '-eAddress.password -eAddress.phoneNumber',
    );
    if (!getMe)
      return next(
        new AppError(
          `ME is lost. Can't find. Create One and maybe you'll find.`,
        ),
      );

    return res.status(200).json({
      status: 'Success',
      data: getMe,
    });
  } catch (err) {
    console.log(`GET ME | USER CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = me;
