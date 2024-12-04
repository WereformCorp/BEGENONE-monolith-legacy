const axios = require('axios');
const catchAsync = require('../../utils/catchAsync');
const { urlPath } = require('../util-controllers/urlPath-TimeController');
const User = require('../../models/userModel');
const Video = require('../../models/videoModel');
const Channel = require('../../models/channelModel');

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
    const thumbnailMap = new Map(
      thumbnails.map((item) => [item.thumbnail, item.url]),
    );

    const thumbnailKey = video.thumbnail || null;

    // Debugging Logs
    // console.log('Thumbnail Key:', thumbnailKey);
    // console.log('Thumbnail Map:', thumbnailMap);

    video.thumbnailUrl = thumbnailMap.get(thumbnailKey) || null;

    // console.log(`VIDEO FROM SINGLE UPLOAD: `, video.thumbnailUrl);
    // console.log(`THUMBNAILS FROM SINGLE UPLOAD: `, thumbnails);

    res.status(200).render(`../views/settings/channel/singleUpload`, {
      title: `Single Uploads`,
      video,
      thumbnail: video.thumbnailUrl,
      user,
      channel,
      comments,
      useCustomLeftNav: true,
    });
  } catch (err) {
    console.log(`SINGLE VIDEO | VIEWS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = singleVideo;
