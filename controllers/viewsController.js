const Video = require('../models/videoModel');
// const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get Tour Data from Tour Collection
  const videos = await Video.find();

  if (!videos) next(new AppError(`There are no videos to be found.`, 404));
  videos.user = req.user;

  // 3) Render that template using tour data from step 1)
  // res.status(200).render('../views/main/contents/mainVideo', {
  res.status(200).render('../views/main/mainVideoCard', {
    title: 'All Videos',
    videos,
  });
});

// //////////////////// THE ABOVE CODE IS A SAMPLE CODE AND IS THERE JUST FOR TESTING PURPOSES
