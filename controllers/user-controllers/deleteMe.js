const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');

const deleteMe = catchAsync(async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: 'Success',
      data: null,
    });
  } catch (err) {
    console.log(`DELETE ME | USER CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = deleteMe;
