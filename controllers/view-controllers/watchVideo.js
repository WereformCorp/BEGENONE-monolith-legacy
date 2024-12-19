const axios = require('axios');
const Video = require('../../models/videoModel');

const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const {
  urlPath,
  calculateTimeAgo,
} = require('../util-controllers/urlPath-TimeController');

const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN; // e.g., "https://d12345.cloudfront.net"
const s3BucketDomain = `https://begenone-images.s3.us-east-1.amazonaws.com`;

const watchVideo = catchAsync(async (req, res, next) => {
  try {
    const video = await axios.get(
      `${urlPath}/api/v1/videos/${req.params.videoId}`,
    );

    // console.log(`VIDEO FROM WATCH VIDEO FUNCTION:`, video.data);

    const thumbnailsResponse = await axios.get(
      `${urlPath}/api/v1/videos/thumbnail`,
    );

    // console.log(`THUMBNAIL RESPONSE:`, thumbnailsResponse.data);
    // console.log(`Video: `, video.data.data.video); // It shows video: 'video-673f3a40df3cd649cfdc8592-1732207453155.mp4',

    // const videoUrl = streamedData.data.url;
    const videoData = video.data.data;
    const videos = await axios.get(`${urlPath}/api/v1/videos/`);
    // const channelsOfRecommendedVideos = videos.channel;

    const { channel } = videoData;
    const localUser = res.locals.user;
    const videoUserData = await Video.findById(req.params.videoId)
      .populate('user')
      .populate('channel');

    const thumbnails = thumbnailsResponse.data.urls;

    const thumbnailMap = new Map(
      thumbnails.map((item) => [
        item.thumbnail,
        `${cloudFrontDomain}/${item.thumbnail}`,
      ]),
    );

    const videoFileName = video.data.data.video;
    const videosData = videos.data.data;
    const filteredVideos = videosData.filter((videoD) => videoD.channel);

    console.log(`Filtered Videos:`, filteredVideos);

    // Create the CloudFront URL by combining the CloudFront domain and the file name
    const cloudFrontVideoUrl = videoFileName
      ? `${cloudFrontDomain}/${videoFileName}`
      : null;

    // let videoTimeAgo;
    filteredVideos.forEach((videoD) => {
      videoD.videoTimeAgo = calculateTimeAgo(videoD.time);
      videoD.thumbnailUrl = thumbnailMap.get(videoD.thumbnail) || null;

      // Retrieve channelLogoUrl for each video
      const videoChannel = videoD.channel; // Each video has its own channel object
      videoD.channelLogoUrl =
        videoChannel && videoChannel.channelLogo
          ? `${cloudFrontDomain}/${videoChannel.channelLogo}`
          : null;

      // Check if the thumbnail is the default one
      if (videoD.thumbnail === 'default-thumbnail.png') {
        videoD.thumbnailUrl = `${s3BucketDomain}/default-thumbnail.png`;
      } else {
        // Use CloudFront if the thumbnail is not the default one
        videoD.thumbnailUrl = thumbnailMap.get(videoD.thumbnail) || null;
      }
    });

    if (!filteredVideos || filteredVideos.length === 0) {
      return next(new AppError(`There are no videos to be found.`, 404));
    }

    const shuffleArray = (array) => {
      // eslint-disable-next-line no-plusplus
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
      }
    };

    shuffleArray(filteredVideos); // Shuffle the videos

    const limitedVideos = filteredVideos.slice(0, 6);

    const comments = Array.isArray(videoData.comments)
      ? videoData.comments.map((obj) => obj)
      : [];
    if (
      !videoUserData ||
      !videoUserData.user ||
      !Array.isArray(videoUserData.user.subscribedChannels)
    ) {
      throw new AppError(`Invalid user data for the video.`, 500);
    }
    await Video.findByIdAndUpdate(videoData._id, { $inc: { views: 1 } });
    const { subscribers } = videoUserData.channel;
    let isUserSubscribed;
    if (localUser) isUserSubscribed = subscribers.includes(localUser._id);

    let btnText = 'Subscribe';
    let btnClass = 'sect-mid-vdoP-subsBtn';

    if (
      res.locals === undefined &&
      res.locals.user._id === videoUserData.user._id
    ) {
      btnText = 'Analytics';
      btnClass = 'sect-mid-vdoP-subsBtn-done';
    } else if (isUserSubscribed) {
      btnText = 'Subscribed';
      btnClass = 'sect-mid-vdoP-subsBtn-done';
    }

    let firstName;
    let secondName;
    // eslint-disable-next-line array-callback-return
    comments.map((comment) => {
      // eslint-disable-next-line prefer-destructuring
      firstName = comment.user.name.firstName;
      // eslint-disable-next-line prefer-destructuring
      secondName = comment.user.name.secondName;
    });

    let areChannelSame;
    if (localUser && localUser.channel) {
      areChannelSame =
        channel._id.toString() === localUser.channel._id.toString();
    }

    const shareLink = `${urlPath}/watch/${videoData._id}`;
    const copyLinkText = `Click on the link to Copy 👇`;

    const channelLogoUrl =
      channel && channel.channelLogo
        ? `${cloudFrontDomain}/${channel.channelLogo}`
        : null;

    // console.log(`LOCAL USER:`, localUser);

    const videoTimeAgo = calculateTimeAgo(videoData.time);
    res.status(200).render('../views/main/contents/mainVideo', {
      title: `${videoData.title}`,
      video: videoData,
      videoUrl: cloudFrontVideoUrl,
      manyVideos: limitedVideos,
      user: res.locals.user,
      userData: res.locals.user, // [WATCH VIDEOS] PAGE ONLY
      videoIdForComment: req.params.videoId,
      videoUserDataId: videoUserData.user._id,
      videoUserData,
      shareLink,
      copyLinkText,
      isUserSubscribed,
      channel,
      channelLogoUrl,
      areChannelSame,
      comments,
      firstName,
      secondName,
      userId: res.locals.user ? res.locals.user._id : undefined,
      // userData: res.locals.user,
      videoTimeAgo,
      btnClass,
      btnText,
      showAds: res.locals.showAds || null,
    });
  } catch (err) {
    console.log(`WATCH VIDEO | VIEWS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = watchVideo;
