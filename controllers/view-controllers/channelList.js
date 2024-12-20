const axios = require('axios');
const User = require('../../models/userModel');

const catchAsync = require('../../utils/catchAsync');
const { urlPath } = require('../util-controllers/urlPath-TimeController');

const channelsList = catchAsync(async (req, res, next) => {
  try {
    const userData = await User.findById(res.locals.user._id).populate(
      'channel',
    );
    let channels;
    if (userData.subscribedChannels) channels = userData.subscribedChannels;
    let channel;

    if (userData.channel)
      channel = await axios.get(
        `${urlPath}/api/v1/channels/${userData.channel._id}`,
      );

    channel = channel.data.data;
    // console.log(`User Data Channel`, channel);
    const videoData = await axios.get(`${urlPath}/api/v1/videos`);
    // const channel = channels.data.data.map((obj) => obj);
    const videos = videoData.data.data;

    // Fetch all thumbnails
    const thumbnailsResponse = await axios.get(
      `${urlPath}/api/v1/videos/thumbnail`,
    );
    const thumbnails = thumbnailsResponse.data.urls;

    // Create a map of thumbnail filename to URL
    const thumbnailMap = new Map(
      thumbnails.map((item) => [item.thumbnail, item.url]),
    );

    // let videoTimeAgo;
    videos.forEach((videoD) => {
      videoD.thumbnailUrl = thumbnailMap.get(videoD.thumbnail) || null;
    });

    let thumbnailUrl;
    videos.forEach((video) => {
      // eslint-disable-next-line prefer-destructuring
      thumbnailUrl = video.thumbnailUrl;
    });
    res.status(200).render('../views/main/channels/channelsList', {
      title: `THIS IS CHANNELS LIST PAGE`,
      channels,
      channel,
      videos,
      user: res.locals.user,
      userData,
      thumbnailUrl,
      // showAds: res.locals.showAds || null,
    });
  } catch (err) {
    console.log(`ALL VIDEOS | VIEWS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = channelsList;
