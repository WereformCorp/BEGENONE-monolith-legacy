const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');

const deleteUser = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'Success',
      user,
    });
  } catch (err) {
    console.log(`DELETE USERS | USER CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = deleteUser;
