const Video = require('../models/videoModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get Tour Data from Tour Collection
  const videos = await Video.find();

  if (!videos) next(new AppError(`There are no videos to be found.`, 404));

  // 3) Render that template using tour data from step 1)
  res.status(200).render('views/main/contents/mainVideo', {
    title: 'All Tours',
    videos,
  });
});
