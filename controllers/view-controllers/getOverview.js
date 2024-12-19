const axios = require('axios');
const User = require('../../models/userModel');

const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const {
  urlPath,
  calculateTimeAgo,
} = require('../util-controllers/urlPath-TimeController');

const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN; // e.g., "https://d12345.cloudfront.net"
const s3BucketDomain = `https://begenone-images.s3.us-east-1.amazonaws.com`;

const getOverview = catchAsync(async (req, res, next) => {
  try {
    const videos = await axios.get(`${urlPath}/api/v1/videos/`);
    const channelResponse = await axios.get(`${urlPath}/api/v1/channels`);
    const thumbnailsResponse = await axios.get(
      `${urlPath}/api/v1/videos/thumbnail`,
    );
    if (!videos) next(new AppError(`There are no videos to be found.`, 404));
    const { data } = videos.data;
    const localUser = res.locals.user;
    let userData;
    if (localUser)
      userData = await User.findById(localUser._id).populate({
        path: 'channel',
        select: '_id displayImage',
      });
    const channels = channelResponse.data.data;
    const thumbnails = thumbnailsResponse.data.urls;
    const thumbnailMap = new Map(
      thumbnails.map((item) => [
        item.thumbnail,
        `${cloudFrontDomain}/${item.thumbnail}`,
      ]),
    );

    // console.log('Thumbnail Map:', thumbnailMap);

    const channelLogoMap = new Map(
      channels.map((channel) => [
        channel._id,
        channel.channelLogo
          ? `${cloudFrontDomain}/${channel.channelLogo}`
          : null,
      ]),
    );
    const filteredVideos = data.filter((video) => video.channel);
    const channelLogoArray = [];
    filteredVideos.forEach((video) => {
      video.videoTimeAgo = calculateTimeAgo(video.time);
      // if (
      //   // video.thumbnail &&
      //   // video.thumbnail.includes('default-thumbnail.jpeg')
      //   !video.thumbnail ||
      //   video.thumbnail === 'default-thumbnail.jpeg'
      // ) {
      //   video.thumbUrl = `https://begenone-images.s3.us-east-1.amazonaws.com/default-thumbnail.png`;
      // } else {
      //   video.thumbUrl = thumbnailMap.get(video.thumbnail) || null;
      // }
      // Check if thumbnail is the default or missing, use S3 if so
      if (
        !video.thumbnail ||
        video.thumbnail === 'default-thumbnail.jpeg' ||
        video.thumbnail === 'default-thumbnail.png'
      ) {
        video.thumbUrl = `${s3BucketDomain}/default-thumbnail.png`; // S3 URL for default thumbnail
      } else {
        // Use CloudFront URL for valid thumbnails
        video.thumbUrl = thumbnailMap.get(video.thumbnail) || null;
      }

      // console.log(`Looking for thumbnail: ${video.thumbnail}`);
      // console.log(`Mapped URL: ${thumbnailMap.get(video.thumbnail)}`);
      // Handle channel logo
      if (video && video.channel) {
        const channelId = video.channel._id || video.channel;
        video.channel.channelLogo = channelLogoMap.get(channelId) || null;
        video.channelLogo = channelLogoMap.get(channelId) || null;
      }
      channelLogoArray.push({
        channelLogo: video.channelLogo,
      });
    });

    // filteredVideos.forEach((video) => {
    //   console.log(`Video ID: ${video._id}, Thumbnail: ${video.thumbnail}`);
    // });

    const extractedChannelLogo = JSON.stringify(channelLogoArray);
    // console.log(`FEATURE VIDEO's CHANNEL:`, extractedChannelLogo);

    //////////////////////////////////////////////////////////////////////////

    // Shuffle the filteredVideos array randomly
    const shuffleArray = (array) => {
      // eslint-disable-next-line no-plusplus
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
      }
    };

    shuffleArray(filteredVideos); // Shuffle the videos

    const limitedVideos = filteredVideos.slice(0, 21);

    /////////////////////////////////////////////////////////////////////////

    const featuredVideoId = '673f74ba66154c6994b9460f';
    const featuredVideo = limitedVideos.find(
      (video) => video._id.toString() === featuredVideoId,
    );
    const otherVideos = limitedVideos.filter(
      (video) => video._id.toString() !== featuredVideoId,
    );
    const sortedVideos = featuredVideo
      ? [featuredVideo, ...otherVideos]
      : otherVideos;

    // console.log(`Sorted Videos 🔥🔥🔥🔥🔥🔥🔥`, sortedVideos);
    res.status(200).render('../views/main/mainVideoCard', {
      title: 'BEGENONE',
      videos: sortedVideos,
      thumbnail: thumbnailsResponse.data.urls,
      channelLogo: extractedChannelLogo.channelLogo,
      user: res.locals.user,
      userData,
      extractedChannelLogo,
      showAds: res.locals.showAds || null,
    });
  } catch (err) {
    console.log(`GET OVERVIEW | VIEWS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = getOverview;
