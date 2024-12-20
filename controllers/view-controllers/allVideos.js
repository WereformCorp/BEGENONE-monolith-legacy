const axios = require('axios');
const catchAsync = require('../../utils/catchAsync');
const User = require('../../models/userModel');
const Pricing = require('../../models/pricingModel');
const { urlPath } = require('../util-controllers/urlPath-TimeController');

const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN; // e.g., "https://d12345.cloudfront.net"
const s3BucketDomain = `https://begenone-images.s3.us-east-1.amazonaws.com`;

const allVideos = catchAsync(async (req, res, next) => {
  try {
    // console.log(res.locals.user._id);
    // const userData = await axios.get();
    // const userData = await User.findById(res.locals.user._id).populate(
    //   'channel',
    // );

    const userData = await User.findById(res.locals.user._id)
      .populate('channel')
      .populate('currentActiveSubscription');
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
        `${cloudFrontDomain}/${item.thumbnail.replace('.jpeg', '.png')}`, // Modify to use CloudFront URL
      ]),
    );

    const subscriptionActiveStatus = res.locals.subscriptionValid;
    console.log(`SUBSCRIPTION STATUS:`, subscriptionActiveStatus);

    // let thumbnail;
    // let videoTimeAgo;
    // if (videos)
    //   videos.forEach((videoData) => {
    //     videoData.thumbnail =
    //       thumbnailMap.get(videoData.thumbnail) || undefined;
    //     console.log('Video Thumbnail:', videoData.thumbnail);
    //   });
    if (videos) {
      videos.forEach((videoData) => {
        const thumbnailName = videoData.thumbnail;

        // Check if the thumbnail is the default one
        if (
          thumbnailName === 'default-thumbnail.png' ||
          thumbnailName === 'default-thumbnail.jpeg'
        ) {
          // Use S3 bucket for the default thumbnail
          videoData.thumbnail = `${s3BucketDomain}/${thumbnailName}`;
        } else {
          // Use CloudFront URL for other thumbnails
          videoData.thumbnail = thumbnailMap.get(thumbnailName) || undefined;
        }

        console.log('Video Thumbnail:', videoData.thumbnail); // For debugging
      });
    }

    console.log(`VIDEOS`, videos);

    const subscriptionActivityStatus = res.locals.subscriptionValid;
    console.log(`SUBSCRIPTION STATUS:`, subscriptionActivityStatus);

    console.log(`USER DATA FROM THE UPLOAD FILES:`, userData.active);

    // const { subscriptionStatus } = req;
    // const { subscriptionMessage } = req;

    // console.log(`SUBSCRIPTION STATUS:`, subscriptionStatus);
    // console.log(`SUBSCRIPTION STATUS:`, subscriptionMessage);

    const { currentActiveSubscription } = userData;

    let subscriptionFeatures = {};
    let subscriptionStatus = 'inactive';
    let canUpload = false;

    // Check if the user has an active subscription
    if (currentActiveSubscription && currentActiveSubscription.active) {
      subscriptionStatus = currentActiveSubscription.status;

      // Fetch the pricing model associated with the subscription
      const pricing = await Pricing.findById(
        currentActiveSubscription.pricings,
      );

      if (pricing) {
        subscriptionFeatures = pricing.features;

        console.log(`SUBSCRIPTION FEATURES:`, subscriptionFeatures);
        console.log(
          `SUBSCRIPTION FEATURES's VIDEO UPLOAD:`,
          subscriptionFeatures.get('videoUpload'),
        );

        // Check if video upload is allowed
        canUpload = subscriptionFeatures.get('videoUpload') || false;
      }
    }

    console.log(`Can or Cannot Upload:`, canUpload);
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
      subscriptionActiveStatus,
      subscriptionStatus,
      // showAds: res.locals.showAds || null,
    });
  } catch (err) {
    console.log(`ALL VIDEOS | VIEWS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = allVideos;
