const axios = require('axios');
const catchAsync = require('../../utils/catchAsync');
// const Video = require('../../models/videoModel');
const Channel = require('../../models/channelModel');
const { urlPath } = require('../util-controllers/urlPath-TimeController');

const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN; // e.g., "https://d12345.cloudfront.net"
// const s3BucketDomain = `https://begenone-images.s3.us-east-1.amazonaws.com`;
const channelLogoDefault = `https://begenone-images.s3.amazonaws.com/default-user-photo.jpg`;

const clipZ = catchAsync(async (req, res, next) => {
  try {
    console.log(
      `CLIPZ | VIEWS CONTROLLER | REQ.PARAMS.VIDEOID ⭕⭕⭕`,
      req.params.videoId,
    );
    // const video = await Video.findById(req.params.videoId).populate('channel');
    const videoData = await axios.get(
      `${urlPath}/api/v1/videos/${req.params.videoId}`,
    );

    const video = videoData.data.data;
    console.log(`CLIPZ | VIEWS CONTROLLER | VIDEOS DATA ⭕⭕⭕`, video);

    const channelId = video.channel._id;
    const channelData = await Channel.findById(channelId);

    const channelLogo = channelData.channelLogo
      ? `${cloudFrontDomain}/${channelData.channelLogo}`
      : channelLogoDefault;

    console.log(`CLIPZ | VIEWS CONTROLLER | CHANNEL LOGO ⭕⭕⭕`, channelLogo);

    console.log(`CLIPZ | VIEWS CONTROLLER | CHANNEL DATA ⭕⭕⭕`, channelData);

    video.cloudFrontUrl = video.video
      ? `${cloudFrontDomain}/${video.video}`
      : null;

    const comments = Array.isArray(video.comments)
      ? video.comments.map((obj) => obj)
      : [];

    let firstName;
    let secondName;

    // eslint-disable-next-line array-callback-return
    comments.map((comment) => {
      // eslint-disable-next-line prefer-destructuring
      firstName = comment.user.name.firstName;
      // eslint-disable-next-line prefer-destructuring
      secondName = comment.user.name.secondName;
    });

    res.status(200).render('../views/main/contents/clipZ', {
      title: `${video.title} | ClipZ`,
      userData: res.locals.user,
      user: res.locals.user,
      video,
      channelLogo,
      comments: video.comments,
      firstName,
      secondName,
      showAds: res.locals.showAds,
      videoIdForComment: req.params.videoId,
    });
  } catch (err) {
    console.log(`CLIPZ | VIEWS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = clipZ;
