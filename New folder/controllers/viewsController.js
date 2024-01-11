// const Channel = require('../models/channelModel');
const axios = require('axios');

// const Video = require('../models/videoModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get Tour Data from Tour Collection
  const videos = await axios.get(`http://127.0.0.1:3000/api/v1/videos`);
  if (!videos) next(new AppError(`There are no videos to be found.`, 404));

  // 3) Render that template using tour data from step 1)
  res.status(200).render('../views/main/mainVideoCard', {
    title: 'All Videos',
    videos: videos.data.data,
  });
});

exports.watchVideo = catchAsync(async (req, res, next) => {
  const video = await axios.get(
    `http://127.0.0.1:3000/api/v1/videos/${req.params.videoId}`,
  );
  const videoData = video.data.data;

  const videos = await axios.get(`http://127.0.0.1:3000/api/v1/videos/`);
  const multiplevideos = videos.data.data;
  const videosData = multiplevideos.map((obj) => obj);

  if (!videoData) next(new AppError(`There are no videos to be found.`, 404));
  const comments = Array.isArray(videoData.comments)
    ? videoData.comments.map((obj) => obj)
    : [];
  // const commentsTime = videoData.comments.map((obj) => obj.time);
  // console.log(videoData.comments);

  // const channelName = videoData.channel
  //   ? videoData.channel.name
  //   : 'Unknown Channel';

  console.log(videoData);

  res.status(200).render('../views/main/contents/mainVideo', {
    title: `${videoData.title}`,
    video: videoData,
    manyVideos: videosData,
    comments,
    // commentTime: commentsTime,
  });
});

exports.channelsList = catchAsync(async (req, res, next) => {
  const channels = await axios.get('http://127.0.0.1:3000/api/v1/channels');
  const videoData = await axios.get(`http://127.0.0.1:3000/api/v1/videos/`);
  const channel = channels.data.data.map((obj) => obj); // THIS WON'T GIVE RESULTS OF SOME SPECIFIED CHANNEL BECAUSE There is no Id associated to it so how can it give a number to fill in its place on the page while there are multiple documents and how will it know which one to select. so we have set a default id of a channel and give that channel's details while allowing other channel list to be shown as well on the top.
  console.log(channel);

  // console.log(videoData.data.data);
  const videos = videoData.data.data;

  res.status(200).render('../views/main/channels/channelsList', {
    title: `THIS IS CHANNELS LIST PAGE`,
    channels,
    channel,
    videos,
    // video: videoData,
    // manyVideos: videosData,
    // comments: comments,
    // commentTime: commentsTime,
  });
});

exports.search = catchAsync(async (req, res, next) => {
  // const video = await axios.get(
  //   `http://127.0.0.1:3000/api/v1/videos/${req.params.videoId}`,
  // );

  const videos = await axios.get(`http://127.0.0.1:3000/api/v1/videos/`);
  const video = await axios.get(
    `http://127.0.0.1:3000/api/v1/videos/65a02ed4c78aed5eb0745ade`,
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
