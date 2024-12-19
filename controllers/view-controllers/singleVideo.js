const axios = require('axios');
const catchAsync = require('../../utils/catchAsync');
const { urlPath } = require('../util-controllers/urlPath-TimeController');
const User = require('../../models/userModel');
const Video = require('../../models/videoModel');
const Channel = require('../../models/channelModel');

const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN; // e.g., "https://d12345.cloudfront.net"
const s3BucketDomain = `https://begenone-images.s3.us-east-1.amazonaws.com`;

const singleVideo = catchAsync(async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.videoId);
    const user = await User.findById(res.locals.user._id);
    let comments;
    // eslint-disable-next-line prefer-destructuring
    if (video) comments = video.comments;
    let channel;
    if (res.locals.user.channel)
      channel = await Channel.findById(res.locals.user.channel._id);
    // console.log(comments);
    const thumbnailsResponse = await axios.get(
      `${urlPath}/api/v1/videos/thumbnail`,
    );

    const thumbnails = thumbnailsResponse.data.urls;

    // Map thumbnails to easily look up URLs by thumbnail name
    // const thumbnailMap = new Map(
    //   thumbnails.map((item) => [item.thumbnail, item.url]),
    // );

    // const thumbnailKey = video.thumbnail || null;

    // Debugging Logs
    // console.log('Thumbnail Key:', thumbnailKey);
    // console.log('Thumbnail Map:', thumbnailMap);

    // video.thumbnailUrl = thumbnailMap.get(thumbnailKey) || null;

    // Map thumbnails to easily look up CloudFront URLs by thumbnail name
    const thumbnailMap = new Map(
      thumbnails.map((item) => [
        item.thumbnail,
        `${cloudFrontDomain}/${item.thumbnail.replace('.jpeg', '.png')}`, // CloudFront URL for non-default thumbnails
      ]),
    );

    const thumbnailKey = video.thumbnail || null;

    // Logic to determine if the thumbnail should come from CloudFront or S3
    if (
      thumbnailKey === 'default-thumbnail.png' ||
      thumbnailKey === 'default-thumbnail.jpeg'
    ) {
      // Use S3 URL for default thumbnail
      video.thumbnailUrl = `${s3BucketDomain}/${thumbnailKey}`;
    } else {
      // Use CloudFront URL for other thumbnails
      video.thumbnailUrl = thumbnailMap.get(thumbnailKey) || null;
    }

    console.log(`VIDEO FROM SINGLE UPLOAD: `, video.thumbnailUrl);
    // console.log(`THUMBNAILS FROM SINGLE UPLOAD: `, thumbnails);

    res.status(200).render(`../views/settings/channel/singleUpload`, {
      title: `Single Uploads`,
      video,
      thumbnail: video.thumbnailUrl,
      user,
      channel,
      comments,
      useCustomLeftNav: true,
      showAds: res.locals.showAds || null,
    });
  } catch (err) {
    console.log(`SINGLE VIDEO | VIEWS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = singleVideo;
