const axios = require('axios');

// eslint-disable-next-line import/no-extraneous-dependencies
const { formatDistanceToNow } = require('date-fns');

const User = require('../models/userModel');
const Video = require('../models/videoModel');
const Channel = require('../models/channelModel');
const Notification = require('../models/notificationModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

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
    const videos = await axios.get(`http://127.0.0.1:3000/api/v1/videos`);
    if (!videos) next(new AppError(`There are no videos to be found.`, 404));
    const { data } = videos.data;
    const localUser = res.locals.user;
    let userData;
    if (localUser)
      userData = await User.findById(localUser._id).populate({
        path: 'channel',
        select: '_id displayImage',
      });

    // let videoTimeAgo;
    data.forEach((video) => {
      video.videoTimeAgo = calculateTimeAgo(video.time);
    });

    res.status(200).render('../views/main/mainVideoCard', {
      title: 'BeGenuine',
      videos: data,
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
      `http://127.0.0.1:3000/api/v1/videos/${req.params.videoId}`,
    );
    const videoData = video.data.data;
    const videos = await axios.get(`http://127.0.0.1:3000/api/v1/videos/`);
    const { channel } = videoData;
    const localUser = res.locals.user;
    const videoUserData = await Video.findById(req.params.videoId)
      .populate('user')
      .populate('channel');
    let userData;
    if (localUser)
      userData = await User.findById(localUser._id).populate({
        path: 'channel',
        select: '_id displayImage',
      });
    else userData = null;

    if (!videos.data.data)
      next(new AppError(`There are no videos to be found.`, 404));

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
    const isUserSubscribed = subscribers.includes(localUser._id);

    let btnText = 'Subscribe';
    let btnClass = 'sect-mid-vdoP-subsBtn';

    if (res.locals.user._id === videoUserData.user._id) {
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

    const videoTimeAgo = calculateTimeAgo(videoData.time);
    res.status(200).render('../views/main/contents/mainVideo', {
      title: `${videoData.title}`,
      video: videoData,
      manyVideos: videos.data.data,
      user: res.locals.user,
      videoIdForComment: req.params.videoId,
      videoUserDataId: videoUserData.user._id,
      videoUserData,
      isUserSubscribed,
      channel,
      areChannelSame,
      comments,
      firstName,
      secondName,
      userData,
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
      `http://127.0.0.1:3000/api/v1/channels/${userData.channel._id}`,
    );
  const videoData = await axios.get(`http://127.0.0.1:3000/api/v1/videos`);
  // const channel = channels.data.data.map((obj) => obj);
  const videos = videoData.data.data;
  res.status(200).render('../views/main/channels/channelsList', {
    title: `THIS IS CHANNELS LIST PAGE`,
    channels,
    channel,
    videos,
    user: res.locals.user,
    userData,
  });
});

exports.search = catchAsync(async (req, res, next) => {
  // const videos = await axios.get(`http://127.0.0.1:3000/api/v1/videos/`);
  const searchTerm = req.query.query;
  // console.log(searchTerm);
  try {
    const response = await axios.get(
      `http://127.0.0.1:3000/search/content?query=${searchTerm}`,
    );
    const data = response.data.results;
    // console.log(`VIDEO'S DATA from Views Controller: ${data}`);

    const videosData = data.map((video) => video.item);
    // console.log(videosData);

    let videoTimeAgo;
    videosData.forEach((video) => {
      videoTimeAgo = calculateTimeAgo(video.time);
    });

    if (!videosData) {
      return next(new AppError(`There are no videos to be found.`, 404));
    }
    // console.log(`VIDEO DATA IS HERE: ${videosData}`);

    if (!videosData)
      return next(new AppError(`There are no videos to be found.`, 404));
    res.status(200).render('../views/main/search/_listSearch', {
      title: `Search Videos`,
      user: res.locals.user,
      videos: videosData,
      videoTimeAgo,
    });
  } catch (err) {
    res.json({
      status: 'Fail',
      message: err.message,
      err,
    });
  }
});

exports.clipZ = catchAsync(async (req, res, next) => {
  const videos = await axios.get(`http://127.0.0.1:3000/api/v1/videos/`);
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
  res.status(200).render(`../views/settings/channel/uploads/_uploads`, {
    title: 'USER PROFILE',
    useCustomLeftNav: true,
    userData,
  });
});

exports.userChannel = catchAsync(async (req, res, next) => {
  const userData = await User.findById(res.locals.user._id).populate('channel');
  const videoData = await User.findById(res.locals.user._id).populate({
    path: 'channel',
    populate: {
      path: 'videos',
      options: { sort: { createdAt: -1 } },
    },
  });
  const { channel } = userData;
  const latestVideo = videoData.channel.videos[0];
  res.status(200).render(`../views/main/channels/userChannel`, {
    title: 'USER PROFILE',
    userData,
    channel,
    videos: channel.videos,
    user: res.locals.user,
    latestVideo,
  });
});

exports.singleChannel = catchAsync(async (req, res, next) => {
  const data = await axios.get(
    `http://127.0.0.1:3000/api/v1/channels/${req.params.id}`,
  );
  const extractedData = data.data.data;
  const channelData = await Channel.findById(extractedData._id);
  res.status(200).render(`../views/main/channels/userChannel`, {
    title: 'USER PROFILE',
    channel: channelData,
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
  const userData = await User.findById(res.locals.user._id).populate('channel');
  let videos;
  if (userData.channel) {
    // eslint-disable-next-line prefer-destructuring
    videos = userData.channel.videos;
  }
  res.status(200).render(`../views/settings/channel/allUploads`, {
    title: `All Uploads`,
    videos,
    user: res.locals.user,
    useCustomLeftNav: true,
    userData,
  });
});

exports.singleVideo = catchAsync(async (req, res, next) => {
  res.status(200).render(`../views/settings/channel/singleUpload`, {
    title: `Single Uploads`,
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
//       'http://127.0.0.1:3000/api/v1/notification/get-user-notification',
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
