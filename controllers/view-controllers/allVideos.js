const axios = require('axios');
const catchAsync = require('../../utils/catchAsync');
const User = require('../../models/userModel');
const { urlPath } = require('../util-controllers/urlPath-TimeController');

const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN; // e.g., "https://d12345.cloudfront.net"

const allVideos = catchAsync(async (req, res, next) => {
  try {
    // console.log(res.locals.user._id);
    // const userData = await axios.get();
    const userData = await User.findById(res.locals.user._id).populate(
      'channel',
    );
    // console.log(`USER DATA:`, userData);
    let videos;
    if (userData.channel) {
      // eslint-disable-next-line prefer-destructuring
      videos = userData.channel.videos;
    }

    let thumbnails = [];
    try {
      const thumbnailsResponse = await axios.get(
        `${urlPath}/api/v1/videos/thumbnail`,
        { timeout: 5000 }, // Optional: set a timeout for the request
      );
      thumbnails = thumbnailsResponse.data.urls || [];
    } catch (error) {
      console.error('Error fetching thumbnails:', error.message);
      return res.status(500).send('Failed to fetch thumbnails'); // Optional: send response for failed request
    }

    if (!thumbnails.length) {
      // Handle case where no thumbnails are returned
      console.log('No thumbnails found.');
    }

    // Map thumbnails to easily look up CloudFront URLs by thumbnail name
    const thumbnailMap = new Map(
      thumbnails.map((item) => [
        item.thumbnail,
        `${cloudFrontDomain}/${item.thumbnail}`, // Modify to use CloudFront URL
      ]),
    );

    // let thumbnail;
    // let videoTimeAgo;
    if (videos)
      videos.forEach((videoData) => {
        videoData.thumbnail =
          thumbnailMap.get(videoData.thumbnail) || undefined;
      });

    // console.log(`VIDEOS`, videos);

    // console.log(`Video Data:`, thumbnail);

    res.status(200).render(`../views/settings/channel/allUploads`, {
      title: `All Uploads`,
      videos,
      // thumbnail,
      user: res.locals.user,
      useCustomLeftNav: true,
      userData,
      channel: userData.channel,
      userActiveStatus: userData.active,
    });
  } catch (err) {
    console.log(`ALL VIDEOS | VIEWS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = allVideos;
