/**
 * @fileoverview Authenticated user's own channel page view renderer
 * @module controllers/view-controllers/userChannel
 * @layer Controller (View)
 *
 * @description
 * Renders the authenticated user's own channel page. Fetches user data with
 * populated channel and videos (sorted by creation date), extracts wires data,
 * and passes them to the userChannel template.
 *
 * @dependencies
 * - Upstream: view route handler (authenticated)
 * - Downstream: User model, catchAsync
 */
const catchAsync = require('../../utils/catchAsync');
const User = require('../../models/userModel');

const userChannel = catchAsync(async (req, res, next) => {
  try {
    // const userData = await User.findById(res.locals.user._id).populate('channel');
    const userData = await User.findById(res.locals.user._id).populate({
      path: 'channel',
      populate: {
        path: 'videos',
        options: { sort: { createdAt: -1 } },
      },
    });
    const wiresData = userData.channel.wires;
    const isItMyChannel = req.path === '/user-channel';
    // console.log(`🔥🔥🔥🔥🔥🔥🔥${isItMyChannel === true ? 'Yes' : 'No'}`);
    const { channel } = userData;
    // console.log(wiresData);
    // console.log(`This is User About 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥: ${channel.about}`);
    const latestVideo = userData.channel.videos[0];
    let wireTime;
    // wiresData.forEach((video) => {
    //   wireTime = calculateTimeAgo(video.time);
    // });

    console.log(`USER DATA:`, userData);

    res.status(200).render(`../views/main/channels/userChannel`, {
      title: 'USER PROFILE',
      userData,
      channel,
      videos: channel.videos,
      user: res.locals.user,
      latestVideo,
      wiresData,
      wireTime,
      isItMyChannel,
      showAds: res.locals.showAds,
    });
  } catch (err) {
    console.log(`USER CHANNEL | Views Controller | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = userChannel;
