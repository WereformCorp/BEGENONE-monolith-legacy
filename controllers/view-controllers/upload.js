const catchAsync = require('../../utils/catchAsync');
const User = require('../../models/userModel');

const upload = catchAsync(async (req, res, next) => {
  try {
    const userData = await User.findById(res.locals.user._id).populate(
      'channel',
    );

    console.log(`USER DATA FROM THE UPLOAD FILES:`, userData.active);

    res.status(200).render(`../views/settings/channel/uploads/_uploads`, {
      title: 'USER PROFILE',
      useCustomLeftNav: true,
      userData,
      userActiveStatus: userData.active,
    });
  } catch (err) {
    console.log(`UPLOAD | Views Controller | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = upload;
