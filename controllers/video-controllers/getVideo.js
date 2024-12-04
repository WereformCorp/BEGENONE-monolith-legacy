const Video = require('../../models/videoModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

const getVideo = catchAsync(async (req, res, next) => {
  try {
    const data = await Video.findById(req.params.id);
    if (!data)
      return next(new AppError(`Data you are looking for, do not exist.`, 404));
    // console.log(data);
    // return data;
    res.status(200).json({
      status: 'Success',
      data,
    });
  } catch (err) {
    console.log(`GET VIDEO | VIDEO CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = getVideo;
