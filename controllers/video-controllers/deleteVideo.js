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
