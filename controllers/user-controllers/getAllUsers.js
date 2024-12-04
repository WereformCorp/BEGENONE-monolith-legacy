const User = require('../../models/userModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

const getAllUsers = catchAsync(async (req, res, next) => {
  try {
    const users = await User.find().populate({
      path: 'channel',
      select: '-__v',
    });

    if (!users) return next(new AppError(`Users Not Found!`, 404));

    res.status(200).json({
      status: 'Success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    console.log(`GET ALL USERS | USER CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = getAllUsers;
