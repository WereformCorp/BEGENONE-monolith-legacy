/**
 * @fileoverview Video document deletion by ID
 * @module controllers/video-controllers/deleteVideo
 * @layer Controller
 *
 * @description
 * Deletes a single Video document identified by its route parameter ID.
 * Returns HTTP 204 on success or 404 when the document is not found.
 *
 * @dependencies
 * - Upstream: video route handler
 * - Downstream: Video model, catchAsync
 */
const Video = require('../../models/videoModel');
const catchAsync = require('../../utils/catchAsync');

const deleteVideo = catchAsync(async (req, res, next) => {
  try {
    const data = await Video.findByIdAndDelete(req.params.id);

    return res.status(204).json({
      status: 'success',
      data,
    });
  } catch (err) {
    return res.status(404).json({
      status: 'fail',
      message: err.message,
      err,
    });
  }
});

module.exports = deleteVideo;
