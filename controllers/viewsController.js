const axios = require('axios');

// eslint-disable-next-line import/no-extraneous-dependencies
const { formatDistanceToNow } = require('date-fns');

const User = require('../models/userModel');
const Video = require('../models/videoModel');
const Channel = require('../models/channelModel');
// const Notification = require('../models/notificationModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN; // e.g., "https://d12345.cloudfront.net"

let urlPath;
if (process.env.NODE_ENV === 'production') {
  // Use the production domain
  urlPath = `https://begenone.com`;
  // eslint-disable-next-line no-else-return
} else if (process.env.NODE_ENV === 'development') {
  // Use the req object for development
  urlPath = `http://127.0.0.1:3000`;
}

// //////////////////////

const calculateTimeAgo = (videoTime) => {
  const secondsAgo = Math.floor((new Date() - new Date(videoTime)) / 1000);

  if (secondsAgo < 60) {
    return `${secondsAgo} seconds ago`;
  }
  if (secondsAgo < 3600) {
    const minutesAgo = Math.floor(secondsAgo / 60);
    return `${minutesAgo} minutes ago`;
  }
  if (secondsAgo < 86400) {
    const hoursAgo = Math.floor(secondsAgo / 3600);
    return `${hoursAgo} hours ago`;
  }
  if (secondsAgo < 604800) {
    const daysAgo = Math.floor(secondsAgo / 86400);
    if (daysAgo === 1) {
      return 'Yesterday';
    }
    if (daysAgo < 7) {
      return `${daysAgo} days ago`;
    }
  }

  // For cases where the time difference is larger than a week, use formatDistanceToNow
  return formatDistanceToNow(new Date(videoTime), { addSuffix: true });
};

// //////////////////////

exports.getOverview = catchAsync(async (req, res, next) => {
  try {
    const videos = await axios.get(`${urlPath}/api/v1/videos`);
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

    // console.log(videos.data.data);
    // console.log(`RESPONSE ----> USER:`, res.locals.user);

    const thumbnails = thumbnailsResponse.data.urls;

    // Map thumbnails to easily look up URLs by thumbnail name
    const thumbnailMap = new Map(
      thumbnails.map((item) => [
        item.thumbnail,
        `${cloudFrontDomain}/${item.thumbnail}`, // Combine CloudFront domain and the thumbnail name
      ]),
    );

    console.log(`THUMBNAIL MAP LINE 83 VIEWS CONTROLLER`, thumbnailMap);

    // Filter out videos without a valid channel
    const filteredVideos = data.filter((video) => video.channel);

    // let videoTimeAgo;
    // filteredVideos.forEach((video) => {
    //   video.videoTimeAgo = calculateTimeAgo(video.time);
    //   video.thumbnailUrl = thumbnailMap.get(video.thumbnail) || null;
    // });

    filteredVideos.forEach((video) => {
      video.videoTimeAgo = calculateTimeAgo(video.time);

      // Get the thumbnail URL from the map; if not found, set it to null
      console.log(`THUMBNAIL PATH`, video);

      video.thumbUrl = thumbnailMap.get(video.thumbnail) || null;
    });

    // Define the videoId that should be featured at the top (example hardcoded)
    const featuredVideoId = '673f74ba66154c6994b9460f'; // Replace this with your dynamic logic if needed

    // Move the featured video to the top if it exists
    const featuredVideo = filteredVideos.find(
      (video) => video._id.toString() === featuredVideoId,
    );
    const otherVideos = filteredVideos.filter(
      (video) => video._id.toString() !== featuredVideoId,
    );

    // Combine the featured video with the rest of the videos
    const sortedVideos = featuredVideo
      ? [featuredVideo, ...otherVideos]
      : otherVideos;

    // console.log(`VIDEOS:`, sortedVideos);

    res.status(200).render('../views/main/mainVideoCard', {
      title: 'BEGENONE',
      videos: sortedVideos,
      thumbnail: thumbnailsResponse.data.urls,
      user: res.locals.user,
      userData,
      // videoTimeAgo,
    });
  } catch (err) {
    return res.json({
      status: 'fail',
      message: err.message,
      err,
    });
  }
});

exports.watchVideo = catchAsync(async (req, res, next) => {
  try {
    const video = await axios.get(
      `${urlPath}/api/v1/videos/${req.params.videoId}`,
    );
    const streamedData = await axios.get(
      `${urlPath}/api/v1/videos/stream/${req.params.videoId}`,
    );

    const thumbnailsResponse = await axios.get(
      `${urlPath}/api/v1/videos/thumbnail`,
    );
    console.log(`Video: `, video.data.data.video); // It shows video: 'video-673f3a40df3cd649cfdc8592-1732207453155.mp4',

    const videoUrl = streamedData.data.url;
    const videoData = video.data.data;
    const videos = await axios.get(`${urlPath}/api/v1/videos/`);
    const { channel } = videoData;
    const localUser = res.locals.user;
    const videoUserData = await Video.findById(req.params.videoId)
      .populate('user')
      .populate('channel');

    const thumbnails = thumbnailsResponse.data.urls;

    // Map thumbnails to easily look up URLs by thumbnail name
    // const thumbnailMap = new Map(
    //   thumbnails.map((item) => [item.thumbnail, item.url]),
    // );

    const thumbnailMap = new Map(
      thumbnails.map((item) => [
        item.thumbnail,
        `${cloudFrontDomain}/${item.thumbnail}`,
      ]),
    );

    const videoFileName = video.data.data.video;
    const videosData = videos.data.data;
    const filteredVideos = videosData.filter((videoD) => videoD.channel);

    // Create the CloudFront URL by combining the CloudFront domain and the file name
    const cloudFrontVideoUrl = videoFileName
      ? `${cloudFrontDomain}/${videoFileName}`
      : null;

    // let videoTimeAgo;
    filteredVideos.forEach((videoD) => {
      videoD.videoTimeAgo = calculateTimeAgo(videoD.time);
      videoD.thumbnailUrl = thumbnailMap.get(videoD.thumbnail) || null;
    });

    if (!filteredVideos || filteredVideos.length === 0) {
      return next(new AppError(`There are no videos to be found.`, 404));
    }

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

    // console.log('THESE ARE COMMENT PART:', comments);

    let areChannelSame;
    if (localUser && localUser.channel) {
      areChannelSame =
        channel._id.toString() === localUser.channel._id.toString();
    }

    // console.log('THIS IS THE CURRENT VIDEO DATA: ', videoData);
    // console.log('THESE ARE MANYVIDEOS DATA:', videos.data.data);

    const shareLink = `${urlPath}/watch/${videoData._id}`;
    const copyLinkText = `Click on the link to Copy 👇`;
    // console.log(shareLink);

    console.log(`RESPONSE LOCALS USER ID:`, res.locals.user);

    const videoTimeAgo = calculateTimeAgo(videoData.time);
    res.status(200).render('../views/main/contents/mainVideo', {
      title: `${videoData.title}`,
      video: videoData,
      videoUrl: cloudFrontVideoUrl,
      manyVideos: filteredVideos,
      // thumbnail: videosData.thumbnailUrl,
      user: res.locals.user,
      videoIdForComment: req.params.videoId,
      videoUserDataId: videoUserData.user._id,
      videoUserData,
      shareLink,
      copyLinkText,
      isUserSubscribed,
      channel,
      areChannelSame,
      comments,
      firstName,
      secondName,
      userId: res.locals.user ? res.locals.user._id : undefined,
      userData: res.locals.user,
      videoTimeAgo,
      btnClass,
      btnText,
    });
  } catch (err) {
    res.json({
      status: 'Fail',
      message: err.message,
      file: 'Error Message Came From Views Controller',
      err,
    });
  }
});

exports.signup = catchAsync(async (req, res, next) => {
  if (res.locals.user) {
    // If the user is logged in, redirect to the main page
    return res.redirect('/');
  }
  res.status(200).render('../views/main/signup', {
    title: `Sign Up | BeGenuine`,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  if (res.locals.user) {
    // If the user is logged in, redirect to the main page
    return res.redirect('/');
  }

  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "script-src 'self' https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.2/axios.min.js 'unsafe-inline' 'unsafe-eval';",
    )
    .render('../views/main/login', {
      title: `Log In | BeGenuine`,
    });
});

exports.channelsList = catchAsync(async (req, res, next) => {
  const userData = await User.findById(res.locals.user._id).populate('channel');
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
  });
});

// exports.search = catchAsync(async (req, res, next) => {
//   // const videos = await axios.get(`${urlPath}/api/v1/videos/`);
//   const searchTerm = req.query.query;
//   // console.log(searchTerm);
//   try {
//     const response = await axios.get(
//       `${urlPath}/search/content?query=${searchTerm}`,
//     );
//     const data = response.data.results;
//     // console.log(`VIDEO'S DATA from Views Controller: ${data}`);

//     const videosData = data.map((video) => video.item);
//     // console.log(videosData);

//     let videoTimeAgo;
//     videosData.forEach((video) => {
//       videoTimeAgo = calculateTimeAgo(video.time);
//     });

//     if (!videosData) {
//       return next(new AppError(`There are no videos to be found.`, 404));
//     }
//     // console.log(`VIDEO DATA IS HERE: ${videosData}`);

//     if (!videosData)
//       return next(new AppError(`There are no videos to be found.`, 404));
//     res.status(200).render('../views/main/search/_listSearch', {
//       title: `Search Videos`,
//       user: res.locals.user,
//       videos: videosData,
//       videoTimeAgo,
//     });
//   } catch (err) {
//     res.json({
//       status: 'Fail',
//       message: err.message,
//       err,
//     });
//   }
// });

// exports.search = catchAsync(async (req, res, next) => {
//   const searchTerm = req.query.query;
//   try {
//     // Fetch search results
//     const response = await axios.get(
//       `${urlPath}/search/content?query=${searchTerm}`,
//     );
//     const data = response.data.results;

//     // Extract video data
//     const videosData = data.map((video) => video.item);

//     // Fetch all thumbnails
//     const thumbnailsResponse = await axios.get(
//       `${urlPath}/api/v1/videos/thumbnail`,
//     );
//     const thumbnails = thumbnailsResponse.data.urls;

//     // Create a map of thumbnail filename to URL
//     const thumbnailMap = new Map(
//       thumbnails.map((item) => [item.thumbnail, item.url]),
//     );

//     // Map the thumbnail URLs to all videos
//     const videosWithThumbnails = videosData.map((video) => ({
//       // ...video,
//       thumbnailUrl: thumbnailMap.get(video.thumbnail) || null,
//       timeAgo: calculateTimeAgo(video.time), // Assuming you have a function to calculate time ago
//     }));

//     if (!videosWithThumbnails || videosWithThumbnails.length === 0) {
//       return next(new AppError('There are no videos to be found.', 404));
//     }

//     // let thumbnailUrl;
//     videosWithThumbnails.forEach((video) => {
//       // eslint-disable-next-line prefer-destructuring
//       video.thumbnailUrl = video.thumbnailUrl;
//     });

//     let videoTimeAgo;
//     videosData.forEach((video) => {
//       // videos = video;
//       videoTimeAgo = calculateTimeAgo(video.time);
//     });

//     console.log(videosData.thumbnailUrl);

//     // Render the search results
//     res.status(200).render('../views/main/search/_listSearch', {
//       title: 'Search Videos',
//       user: res.locals.user,
//       videos: videosData,
//       thumbnailUrl: videosWithThumbnails,
//       videoTimeAgo,
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: 'Fail',
//       message: err.message,
//       err,
//     });
//   }
// });

exports.search = catchAsync(async (req, res, next) => {
  const searchTerm = req.query.query;

  try {
    // Fetch search results
    const response = await axios.get(
      `${urlPath}/search/content?query=${searchTerm}`,
    );
    const data = response.data.results;

    // Extract video data
    const videosData = data.map((video) => video.item);

    // Fetch all thumbnails
    const thumbnailsResponse = await axios.get(
      `${urlPath}/api/v1/videos/thumbnail`,
    );
    const thumbnails = thumbnailsResponse.data.urls;

    // Create a map of thumbnail filename to URL
    const thumbnailMap = new Map(
      thumbnails.map((item) => [item.thumbnail, item.url]),
    );

    // Map the thumbnail URLs to all videos
    const videosWithThumbnails = videosData
      .filter((video) => video.channel)
      .map((video) => ({
        ...video,
        thumbnailUrl: thumbnailMap.get(video.thumbnail) || null,
        timeAgo: calculateTimeAgo(video.time), // Assuming you have a function to calculate time ago
      }));

    // console.log(`Video WITH THUMBNAILS:`, videosWithThumbnails);
    // videosWithThumbnails.forEach((vid) => {
    //   const username = vid.channel.channelUserName;
    //   console.log(`USERNAME:`, username);
    // });

    if (!videosWithThumbnails || videosWithThumbnails.length === 0) {
      return next(new AppError('There are no videos to be found.', 404));
    }

    // Render the search results with the correct videosWithThumbnails
    res.status(200).render('../views/main/search/_listSearch', {
      title: 'Search Videos',
      user: res.locals.user,
      videos: videosWithThumbnails,
    });
  } catch (err) {
    res.status(500).json({
      status: 'Fail',
      message: err.message,
      err,
    });
  }
});

exports.clipZ = catchAsync(async (req, res, next) => {
  const videos = await axios.get(`${urlPath}/api/v1/videos/`);
  const videosData = videos.data.data;
  res.status(200).render('../views/main/contents/clipZ', {
    title: `Search Videos`,
    videos: videosData,
  });
});

exports.userProfile = catchAsync(async (req, res, next) => {
  const userData = await User.findById(res.locals.user._id).populate('channel');
  const userId = userData._id;
  const { channel } = userData;
  let channelUserId;
  if (channel) channelUserId = channel.user._id;
  console.log(`RESPONSE ----> USER:`, res.locals.user);
  res.status(200).render(`../views/settings/user`, {
    title: 'USER PROFILE',
    userData,
    user: res.locals.user,
    channel,
    userId,
    channelUserId,
    useCustomLeftNav: true,
  });
});

exports.upload = catchAsync(async (req, res, next) => {
  const userData = await User.findById(res.locals.user._id).populate('channel');

  // const streamedData = await axios.get(
  //   `${urlPath}/api/v1/videos/stream/${req.params.videoId}`,
  // );

  // const videoUrl = streamedData.data.url;
  // console.log(`Video URL: `, videoUrl);
  // const thumbnailData = await axios.get(
  //   `${urlPath}/api/v1/videos/stream/${req.params.videoId}`,
  // );

  res.status(200).render(`../views/settings/channel/uploads/_uploads`, {
    title: 'USER PROFILE',
    useCustomLeftNav: true,
    userData,
  });
});

exports.userChannel = catchAsync(async (req, res, next) => {
  // const userData = await User.findById(res.locals.user._id).populate('channel');
  const userData = await User.findById(res.locals.user._id).populate({
    path: 'channel',
    populate: {
      path: 'videos',
      options: { sort: { createdAt: -1 } },
    },
  });
  const wiresData = userData.channel.wires;
  const isItMyChannel = req.path === '/user-channel';
  // console.log(`🔥🔥🔥🔥🔥🔥🔥${isItMyChannel === true ? 'Yes' : 'No'}`);
  const { channel } = userData;
  // console.log(wiresData);
  // console.log(`This is User About 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥: ${channel.about}`);
  const latestVideo = userData.channel.videos[0];
  let wireTime;
  wiresData.forEach((video) => {
    wireTime = calculateTimeAgo(video.time);
  });

  res.status(200).render(`../views/main/channels/userChannel`, {
    title: 'USER PROFILE',
    userData,
    channel,
    videos: channel.videos,
    user: res.locals.user,
    latestVideo,
    wiresData,
    wireTime,
    isItMyChannel,
  });
});

exports.singleChannel = catchAsync(async (req, res, next) => {
  const channelData = await axios.get(
    `${urlPath}/api/v1/channels/${req.params.id}`,
  );
  // const userData = await axios.get(
  //   `${urlPath}/api/v1/users/${res.locals.user._id}`,
  // );

  // const { user } = userData.data;

  // const channel = channelData.data;

  // console.log(channel);

  const extractedData = channelData.data.data;
  // console.log(`ExtractedData`, extractedData);
  const { videos } = extractedData;
  console.log(`Extracted --------- Data:`, extractedData);
  // videos.forEach((video) => video);
  const latestVideo =
    extractedData.videos && extractedData.videos.length > 0
      ? extractedData.videos[0]
      : null;
  const wiresData = extractedData.wires.map((wire) => wire);
  // console.log(wiresData);

  const thumbnailsResponse = await axios.get(
    `${urlPath}/api/v1/videos/thumbnail`,
  );

  const thumbnails = thumbnailsResponse.data.urls;

  // Map thumbnails to easily look up URLs by thumbnail name
  const thumbnailMap = new Map(
    thumbnails.map((item) => [item.thumbnail, item.url]),
  );

  const LatestVidThumbKey = latestVideo ? latestVideo.thumbnail : null;

  videos.forEach((video) => {
    video.thumbnailUrl = thumbnailMap.get(video.thumbnail) || null;
  });
  // Debugging Logs
  // console.log('Thumbnail Key:', LatestVidThumbKey);
  // console.log('Thumbnail Map:', thumbnailMap);

  if (latestVideo) {
    latestVideo.thumbnailUrl = thumbnailMap.get(LatestVidThumbKey) || null;
  }

  // console.log(`VIDEO FROM SINGLE CHANNEL: `, latestVideo.thumbnailUrl);
  // console.log(`THUMBNAILS FROM SINGLE CHANNEL: `, thumbnails);

  // console.log(`RESPONSE -> LOCALS -> User:`, res.locals.user);

  // const channelData = await Channel.findById(extractedData._id);
  res.status(200).render(`../views/main/channels/userChannel`, {
    title: 'USER PROFILE',
    channel: extractedData,
    latestVideo,
    videos,
    LatestVideoThumbnail: latestVideo ? latestVideo.thumbnailUrl : null,
    wiresData,
  });
});

exports.channelSettings = catchAsync(async (req, res, next) => {
  const userData = await User.findById(res.locals.user._id).populate('channel');
  const { channel } = userData;
  res.status(200).render(`../views/settings/channel/channel-settings`, {
    title: `Channel Settings`,
    channel,
    user: res.locals.user,
    useCustomLeftNav: true,
    userData,
  });
});

exports.allVideos = catchAsync(async (req, res, next) => {
  // console.log(res.locals.user._id);
  const userData = await User.findById(res.locals.user._id).populate('channel');
  let videos;
  if (userData.channel) {
    // eslint-disable-next-line prefer-destructuring
    videos = userData.channel.videos;
  }
  const thumbnailsResponse = await axios.get(
    `${urlPath}/api/v1/videos/thumbnail`,
  );

  const thumbnails = thumbnailsResponse.data.urls;

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
      videoData.thumbnail = thumbnailMap.get(videoData.thumbnail) || null;
    });

  // console.log(`Video Data:`, thumbnail);

  res.status(200).render(`../views/settings/channel/allUploads`, {
    title: `All Uploads`,
    videos,
    // thumbnail,
    user: res.locals.user,
    useCustomLeftNav: true,
    userData,
    channel: userData.channel,
  });
});

exports.singleVideo = catchAsync(async (req, res, next) => {
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
});

exports.tokens = catchAsync(async (req, res, next) => {
  const userData = await User.findById(res.locals.user._id).populate('channel');
  // const { videos } = userData.channel;
  res.status(200).render(`../views/main/tokens/allTokens`, {
    title: `Tokens | Pricing`,
    userData,
    useCustomLeftNav: true,
  });
});

// exports.notifications = catchAsync(async (req, res, next) => {
//   try {
//     console.log('API Response:');

//     const userNotif = await axios.get(
//       '${urlPath}/api/v1/notification/get-user-notification',
//     );

//     const { data } = userNotif;

//     console.log('User Notification from Views Controller:', data);

//     return res.status(200).render('../views/main/contents/mainVideo', {
//       title: 'Notification',
//       data,
//     });
//   } catch (error) {
//     console.error('Error fetching notifications:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });
