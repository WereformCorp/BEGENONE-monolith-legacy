const axios = require('axios');
const User = require('../models/userModel');
const Video = require('../models/videoModel');
const Channel = require('../models/channelModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

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
    res.status(200).render('../views/main/mainVideoCard', {
      title: 'BeGenuine',
      videos: data,
      user: res.locals.user,
      userData,
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
  const video = await axios.get(
    `http://127.0.0.1:3000/api/v1/videos/${req.params.videoId}`,
  );
  const videoData = video.data.data;
  const videos = await axios.get(`http://127.0.0.1:3000/api/v1/videos/`);
  const localUser = res.locals.user;
  await Video.findByIdAndUpdate(videoData._id, { $inc: { views: 1 } });
  let userData;
  if (localUser)
    userData = await User.findById(localUser._id).populate({
      path: 'channel',
      select: '_id displayImage',
    });
  if (!videos.data.data)
    next(new AppError(`There are no videos to be found.`, 404));
  const comments = Array.isArray(videoData.comments)
    ? videoData.comments.map((obj) => obj)
    : [];

  res.status(200).render('../views/main/contents/mainVideo', {
    title: `${videoData.title}`,
    video: videoData,
    manyVideos: videos.data.data,
    user: res.locals.user,
    comments,
    userData,
  });
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
  const channels = await axios.get('http://127.0.0.1:3000/api/v1/channels');
  const videoData = await axios.get(`http://127.0.0.1:3000/api/v1/videos/`);
  const userData = await User.findById(res.locals.user._id).populate('channel');
  const channel = channels.data.data.map((obj) => obj); // THIS WON'T GIVE RESULTS OF SOME SPECIFIED CHANNEL BECAUSE There is no Id associated to it so how can it give a number to fill in its place on the page while there are multiple documents and how will it know which one to select. so we have set a default id of a channel and give that channel's details while allowing other channel list to be shown as well on the top.
  const videos = videoData.data.data;
  res.status(200).render('../views/main/channels/channelsList', {
    title: `THIS IS CHANNELS LIST PAGE`,
    channels,
    channel,
    videos,
    userData,
  });
});

exports.search = catchAsync(async (req, res, next) => {
  const videos = await axios.get(`http://127.0.0.1:3000/api/v1/videos/`);
  const videosData = videos.data.data;
  if (!videosData) next(new AppError(`There are no videos to be found.`, 404));
  res.status(200).render('../views/main/search/_listSearch', {
    title: `Search Videos`,
    videos: videosData,
  });
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
  const { channel } = userData;
  const userId = channel.user._id;

  console.log(channel.bannerImage);
  res.status(200).render(`../views/main/channels/userChannel`, {
    title: 'USER PROFILE',
    userData,
    channel,
    userId,
  });
});

exports.singleChannel = catchAsync(async (req, res, next) => {
  const data = await axios.get(
    `http://127.0.0.1:3000/api/v1/channels/${req.params.id}`,
  );
  const extractedData = data.data.data;
  const channelData = await Channel.findById(extractedData._id);
  console.log(extractedData.bannerImage);
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
    useCustomLeftNav: true,
    userData,
  });
});

exports.allVideos = catchAsync(async (req, res, next) => {
  const userData = await User.findById(res.locals.user._id).populate('channel');
  const { videos } = userData.channel;
  res.status(200).render(`../views/settings/channel/allUploads`, {
    title: `All Uploads`,
    videos,
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
  });
});
