const { uploadContentToS3 } = require('../aws_s3-controller/s3Controller');
const catchAsync = require('../../utils/catchAsync');
const uploadChannelPfp = require('./uploadChannelPfp');

const s3UploadPfp = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No files uploaded');
  }

  try {
    const channelId = res.locals.user.channel; // Get channel ID from request
    // console.log(`CHANNEL ID FROM VIDEO ROUTES:`, channelId);

    const imageResult = await uploadContentToS3(req.file, channelId, 'image');
    req.s3Data = {
      profilepic: imageResult || null,
    };

    // console.log(`s3Data FROM /PROFILEPIC`, req.s3Data);
    return uploadChannelPfp(req, res);
  } catch (err) {
    console.log(`S3 UPLOADED PFP | CHANNELS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = s3UploadPfp;
