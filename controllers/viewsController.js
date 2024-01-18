const axios = require('axios');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  const videos = await axios.get(`http://127.0.0.1:3000/api/v1/videos`);
  if (!videos) next(new AppError(`There are no videos to be found.`, 404));

  // const userWithChannel = await User.findById(req.user._id).populate('channel');
  // const { channel } = userWithChannel;
  // const userId = req.user._id;
  // console.log(channel);
  const localUser = res.locals.user;
  const userData = await User.findById(localUser._id).populate({
    path: 'channel',
    select: '_id displayImage',
  });
  console.log(userData);

  const isRoot = req.path;
  const { data } = videos.data;

  res.status(200).render('../views/main/mainVideoCard', {
    title: 'BeGenuine',
    videos: data,
    user: res.locals.user,
    userData,
    isRoot,
    // userId,
  });
});

exports.watchVideo = catchAsync(async (req, res, next) => {
  const video = await axios.get(
    `http://127.0.0.1:3000/api/v1/videos/${req.params.videoId}`,
  );
  const videoData = video.data.data;

  const videos = await axios.get(`http://127.0.0.1:3000/api/v1/videos/`);
  // const multipleVideos = ;
  // const videosData = multipleVideos.map((obj) => obj);

  // console.log(videosData.channel.user._id);

  if (!videos.data.data)
    next(new AppError(`There are no videos to be found.`, 404));
  const comments = Array.isArray(videoData.comments)
    ? videoData.comments.map((obj) => obj)
    : [];

  res.status(200).render('../views/main/contents/mainVideo', {
    title: `${videoData.title}`,
    video: videoData,
    manyVideos: videos.data.data,
    comments,
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  res.status(200).render('../views/main/signup', {
    title: `Sign Up | BeGenuine`,
  });
});

exports.login = catchAsync(async (req, res, next) => {
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
  const channel = channels.data.data.map((obj) => obj); // THIS WON'T GIVE RESULTS OF SOME SPECIFIED CHANNEL BECAUSE There is no Id associated to it so how can it give a number to fill in its place on the page while there are multiple documents and how will it know which one to select. so we have set a default id of a channel and give that channel's details while allowing other channel list to be shown as well on the top.

  const videos = videoData.data.data;

  res.status(200).render('../views/main/channels/channelsList', {
    title: `THIS IS CHANNELS LIST PAGE`,
    channels,
    channel,
    videos,
  });
});

exports.search = catchAsync(async (req, res, next) => {
  const videos = await axios.get(`http://127.0.0.1:3000/api/v1/videos/`);
  const video = await axios.get(
    `http://127.0.0.1:3000/api/v1/videos/65a06703f53ecc5918cfe9c4`,
  );

  const videoData = video.data.data;
  const videosData = videos.data.data;
  if (!videosData) next(new AppError(`There are no videos to be found.`, 404));

  res.status(200).render('../views/main/search/_cardSearch', {
    title: `Search Videos`,
    videos: videosData,
    video: videoData,
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
  const user = await User.findById(req.user._id).populate('channel');

  const { channel } = user;
  // console.log(user);

  const userId = channel.user._id;

  res.status(200).render(`../views/settings/user`, {
    title: 'USER PROFILE',
    user,
    channel,
    userId,
    useCustomLeftNav: true,
  });
});

exports.upload = catchAsync(async (req, res, next) => {
  // const userData = await axios.get(
  //   `http://127.0.0.1:3000/api/v1/users/659edfc532803419e05590ae`,
  // );

  // const { user } = userData.data;
  // console.log(user);

  res.status(200).render(`../views/settings/channel/uploads/_uploads`, {
    title: 'USER PROFILE',
    useCustomLeftNav: true,
    // user,
  });
});

exports.userChannel = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('channel');
  const { channel } = user;

  const userId = channel.user._id;
  // console.log(channel);

  res.status(200).render(`../views/main/channels/userChannel`, {
    title: 'USER PROFILE',
    user,
    channel,
    userId,
    // loggedInUser,
    // user,
  });
});

exports.channelSettings = catchAsync(async (req, res, next) => {
  const userWithChannel = await User.findById(req.user._id).populate('channel');
  const { channel } = userWithChannel;
  // console.log(channel);
  res.status(200).render(`../views/settings/channel/channel-settings`, {
    title: `Channel Settings`,
    channel,
    useCustomLeftNav: true,
  });
});

exports.allVideos = catchAsync(async (req, res, next) => {
  const userWithChannel = await User.findById(req.user._id).populate('channel');
  const { videos } = userWithChannel.channel;

  // console.log(videos);

  res.status(200).render(`../views/settings/channel/allUploads`, {
    title: `All Uploads`,
    videos,
    useCustomLeftNav: true,
  });
});

exports.singleVideo = catchAsync(async (req, res, next) => {
  res.status(200).render(`../views/settings/channel/singleUpload`, {
    title: `Single Uploads`,
    useCustomLeftNav: true,
  });
});
