const Channel = require('../../models/channelModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

const uploadChannelBanner = catchAsync(async (req, res, next) => {
  try {
    // Extract necessary data
    const ImageFileData = req.s3Data; // Contains the uploaded image's S3 data
    const { channel } = res.locals.user; // Channel ID from middleware

    if (!ImageFileData || !ImageFileData.banner) {
      return next(new AppError('No profile picture uploaded', 400));
    }

    // Update the channel document
    const updatedChannel = await Channel.findByIdAndUpdate(
      channel, // Use channel ID directly
      {
        bannerImage: ImageFileData.banner.key, // S3 key for the uploaded image
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Enforce validation rules
      },
    );

    if (!updatedChannel) {
      return next(new AppError('Channel not found', 404));
    }

    return res.json({
      status: 'success',
      data: updatedChannel,
    });
  } catch (err) {
    console.log(
      `UPLOAD CHANNEL BANNER | CHANNELS CONTROLLER | ERROR ⭕⭕⭕`,
      err,
    );
    throw err;
  }
});

module.exports = uploadChannelBanner;
