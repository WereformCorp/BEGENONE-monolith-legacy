const catchAsync = require('../../utils/catchAsync');
const User = require('../../models/userModel');

const userProfile = catchAsync(async (req, res, next) => {
  try {
    const userData = await User.findById(res.locals.user._id).populate(
      'channel',
    );
    const userId = userData._id;
    const { channel } = userData;
    let channelUserId;
    if (channel) channelUserId = channel.user._id;
    // console.log(
    //   `RESPONSE LOCALS USER | User Profile | Views Controller:`,
    //   res.locals.user,
    // );

    const subscriptionStatus = res.locals.subscriptionValid;
    console.log(`SUBSCRIPTION STATUS:`, subscriptionStatus);

    res.status(200).render(`../views/settings/user`, {
      title: 'USER PROFILE',
      userData,
      user: res.locals.user,
      channel,
      userId,
      channelUserId,
      useCustomLeftNav: true,
      userActiveStatus: userData.active,
      subscriptionStatus,
    });
  } catch (err) {
    console.log(`USER PROFILE | VIEWS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = userProfile;
