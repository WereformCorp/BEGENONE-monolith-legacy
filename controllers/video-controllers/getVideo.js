/**
 * @fileoverview Single video retrieval by ID
 * @module controllers/video-controllers/getVideo
 * @layer Controller
 *
 * @description
 * Fetches a single Video document by its route parameter ID and returns it
 * in the JSON response. Returns a 404 error when the video is not found.
 *
 * @dependencies
 * - Upstream: video route handler
 * - Downstream: Video model, AppError, catchAsync
 */
const Video = require('../../models/videoModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

const getVideo = catchAsync(async (req, res, next) => {
  try {
    const data = await Video.findById(req.params.id);

    console.log(`DATA FROM GETVIDEO FUNCTION:`, data);
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
