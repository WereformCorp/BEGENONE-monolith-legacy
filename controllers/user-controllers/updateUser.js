const User = require('../../models/userModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

const updateUser = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!user) {
      return next(new AppError('No document Found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      user,
    });
  } catch (err) {
    console.log(`UPDATE USER | USER CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = updateUser;
