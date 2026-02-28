/**
 * @fileoverview Video document update by ID
 * @module controllers/video-controllers/updateVideo
 * @layer Controller
 *
 * @description
 * Updates an existing Video document identified by its route parameter ID.
 * Merges request body fields into the document and optionally sets the
 * display image when a file is attached to the request.
 *
 * @dependencies
 * - Upstream: video route handler
 * - Downstream: Video model, AppError, catchAsync
 */
const Video = require('../../models/videoModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

const updateVideo = catchAsync(async (req, res, next) => {
  try {
    const data = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (req.file) {
      data.displayImage = req.file.fieldname;
    }

    if (!data)
      return next(new AppError(`Data you are looking for, do not exist.`, 404));

    return res.status(200).json({
      status: 'Success',
      data,
    });
  } catch (err) {
    console.log(`UPDATE VIDEO | VIDEO CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = updateVideo;
