const axios = require('axios');
const catchAsync = require('../../utils/catchAsync');
const { urlPath } = require('../util-controllers/urlPath-TimeController');
const Channel = require('../../models/channelModel');

const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN; // e.g., "https://d12345.cloudfront.net"

const singleChannel = catchAsync(async (req, res, next) => {
  try {
    console.log('User:', res.locals.user);
    console.log('REQUESTED USER:', req.params.id);
    console.log(
      `⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ URL PATH ${'⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️'}:`,
      urlPath,
    );
    // const channelData = await axios.get(
    //   `${urlPath}/api/v1/channels/${req.params.id}`,
    // );

    const extractedData = await Channel.findById(req.params.id);

    console.log(`Channel Data ⭕⭕⭕`, extractedData);

    // Map channelLogo and bannerImage fields to CloudFront URLs
    if (extractedData.channelLogo) {
      extractedData.channelLogo = `${cloudFrontDomain}/${extractedData.channelLogo}`; // Save CloudFront URL in profilePicUrl
    }
    if (extractedData.bannerImage) {
      extractedData.bannerImage = `${cloudFrontDomain}/${extractedData.bannerImage}`; // Save CloudFront URL in bannerImageUrl
    }
    // console.log(`ExtractedData`, extractedData);
    const { videos } = extractedData;
    // console.log(`Extracted --------- Data:`, extractedData);
    const latestVideo =
      extractedData.videos && extractedData.videos.length > 0
        ? extractedData.videos[0]
        : null;
    const wiresData = extractedData.wires.map((wire) => wire);

    const thumbnailsResponse = await axios.get(
      `${urlPath}/api/v1/videos/thumbnail`,
    );

    const thumbnails = thumbnailsResponse.data.urls;
    const thumbnailMap = new Map(
      thumbnails.map((item) => [item.thumbnail, item.url]),
    );

    const LatestVidThumbKey = latestVideo ? latestVideo.thumbnail : null;
    videos.forEach((video) => {
      if (
        video.thumbnail &&
        video.thumbnail.includes('default-thumbnail.jpeg')
      ) {
        video.thumbnailUrl = `https://begenone-images.s3.us-east-1.amazonaws.com/default-thumbnail.png`;
      } else {
        // Otherwise, use the CloudFront URL
        video.thumbnailUrl = thumbnailMap.get(video.thumbnail) || null;
      }
    });

    // Debugging Logs
    // console.log('Thumbnail Key:', LatestVidThumbKey);
    // console.log('Thumbnail Map:', thumbnailMap);

    if (latestVideo) {
      if (
        latestVideo.thumbnail &&
        latestVideo.thumbnail.includes('default-thumbnail.jpeg')
      ) {
        latestVideo.thumbnailUrl = `https://begenone-images.s3.us-east-1.amazonaws.com/default-thumbnail.png`;
      } else {
        latestVideo.thumbnailUrl = thumbnailMap.get(LatestVidThumbKey) || null;
      }
    }

    // console.log(`VIDEO FROM SINGLE CHANNEL: `, latestVideo.thumbnailUrl);
    // console.log(`THUMBNAILS FROM SINGLE CHANNEL: `, thumbnails);
    // console.log(`RESPONSE -> LOCALS -> User:`, res.locals.user);

    // const channelData = await Channel.findById(extractedData._id);
    res.status(200).render(`../views/main/channels/userChannel`, {
      title: 'USER PROFILE',
      userData: res.locals.user,
      user: res.locals.user,
      channel: extractedData,
      latestVideo,
      channelLogo: extractedData.channelLogo,
      bannerImage: extractedData.bannerImage,
      videos,
      LatestVideoThumbnail: latestVideo ? latestVideo.thumbnailUrl : null,
      wiresData,
      showAds: res.locals.showAds,
    });
  } catch (err) {
    res.json({
      Message: err.message,
      error: err,
    });
    console.log(`SINGLE CHANNEL | Views Controller | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = singleChannel;
