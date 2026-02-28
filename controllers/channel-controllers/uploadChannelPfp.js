/**
 * @fileoverview Channel profile picture URL persistence
 * @module controllers/channel-controllers/uploadChannelPfp
 * @layer Controller
 *
 * @description
 * Persists the S3 object key for a channel's profile picture (channelLogo field)
 * after the image has been uploaded to S3 by the s3UploadPfp controller.
 * Receives the S3 data from req.s3Data set by the upstream upload handler.
 *
 * @dependencies
 * - Upstream: s3UploadPfp controller (called after S3 upload completes)
 * - Downstream: Channel model, AppError, catchAsync
 */
const Channel = require('../../models/channelModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

const uploadChannelPfp = catchAsync(async (req, res, next) => {
  try {
    // Extract necessary data
    const ImageFileData = req.s3Data; // Contains the uploaded image's S3 data
    const { channel } = res.locals.user; // Channel ID from middleware

    if (!ImageFileData || !ImageFileData.profilepic) {
      return next(new AppError('No profile picture uploaded', 400));
    }

    // Update the channel document
    const updatedChannel = await Channel.findByIdAndUpdate(
      channel, // Use channel ID directly
      {
        channelLogo: ImageFileData.profilepic.key, // S3 key for the uploaded image
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Enforce validation rules
      },
    );

    if (!updatedChannel) {
      return next(new AppError('Channel not found', 404));
    }

    // console.log(`Updated Channel:`, updatedChannel);

    // Respond with success
    return res.status(200).json({
      message: 'Profile picture updated successfully',
      data: updatedChannel._id,
    });
  } catch (err) {
    console.log(`UPLOAD CHANNEL PFP | CHANNELS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = uploadChannelPfp;
