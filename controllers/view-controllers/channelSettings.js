const catchAsync = require('../../utils/catchAsync');
const User = require('../../models/userModel');

const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN; // e.g., "https://d12345.cloudfront.net"

const channelSettings = catchAsync(async (req, res, next) => {
  try {
    const userData = await User.findById(res.locals.user._id).populate(
      'channel',
    );
    const { channel } = userData;

    // Map channelLogo and bannerImage fields to CloudFront URLs
    if (channel && channel.channelLogo) {
      channel.channelLogo = `${cloudFrontDomain}/${channel.channelLogo}`; // Save CloudFront URL in profilePicUrl
    }
    if (channel && channel.bannerImage) {
      channel.bannerImage = `${cloudFrontDomain}/${channel.bannerImage}`; // Save CloudFront URL in bannerImageUrl
    }

    // console.log(`USER FROM VIEWS CONTROLLER:`, res.locals.user);
    // console.log(`USERDATA FROM VIEWS CONTROLLER:`, userData._id);

    res.status(200).render(`../views/settings/channel/channel-settings`, {
      title: `Channel Settings`,
      channel,
      channelLogo: channel ? channel.channelLogo : null,
      bannerImage: channel ? channel.bannerImage : null,
      user: res.locals.user,
      useCustomLeftNav: true,
      userData,
      userDataId: userData._id,
      userActiveStatus: userData.active,
    });
  } catch (err) {
    console.log(`CHANNEL SETTINGS | VIEWS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = channelSettings;
