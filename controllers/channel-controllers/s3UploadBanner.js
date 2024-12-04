const uploadChannelBanner = require('./uploadChannelBanner');
const { uploadContentToS3 } = require('../aws_s3-controller/s3Controller');
const catchAsync = require('../../utils/catchAsync');

const uploadBanner = catchAsync(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No files uploaded');
    }

    try {
      const channelId = res.locals.user.channel; // Get channel ID from request
      console.log(`CHANNEL ID FROM VIDEO ROUTES:`, channelId);

      const imageResult = await uploadContentToS3(req.file, channelId, 'image');
      req.s3Data = {
        banner: imageResult || null,
      };

      console.log(`s3Data FROM /PROFILEPIC`, req.s3Data);
      return uploadChannelBanner.uploadChannelBanner(req, res);

      // return videoController.createVideo(req, res);
    } catch (err) {
      console.log(`ERROR FROM CHANNEL ROUTES`, err);
    }
  } catch (err) {
    console.log(`S3 UPLOAD BANNER | CHANNELS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = uploadBanner;
