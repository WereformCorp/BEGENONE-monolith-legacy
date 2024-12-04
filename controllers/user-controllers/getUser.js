const User = require('../../models/userModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

const getUser = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: 'channel',
      select: '-__v',
    });

    if (!user) next(new AppError(`User Not Found!`, 404));

    res.status(200).json({
      status: 'Success',
      user,
    });
  } catch (err) {
    console.log(`GET USER | USER CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = getUser;
