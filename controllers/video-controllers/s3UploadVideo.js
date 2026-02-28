/**
 * @fileoverview Video upload pipeline via AWS S3
 * @module controllers/video-controllers/s3UploadVideo
 * @layer Controller
 *
 * @description
 * Orchestrates the video upload flow: validates user activation status, uploads
 * the video file to S3, optionally uploads an accompanying thumbnail to S3,
 * then delegates to the createVideo controller to persist the Video document.
 * S3 upload results are attached to `req.s3Data` before delegation.
 *
 * @dependencies
 * - Upstream: video route handler (after multer middleware)
 * - Downstream: s3Controller.uploadContentToS3, createVideo controller, User model
 *
 * @security Rejects uploads from inactive (unverified) user accounts.
 */
const { uploadContentToS3 } = require('../aws_s3-controller/s3Controller');
const createVideo = require('./createVideo');
// const AppError = require('../../utils/appError');
const User = require('../../models/userModel');

const s3UploadVideo = async (req, res) => {
  const user = await User.findById(res.locals.user._id);
  console.log(`RES LOCAL USER ID FROM s3UPLOADVIDEO FUNCTION:`, user);

  if (user && user.active === false)
    return res.status(403).json({
      error: 'USER_INACTIVE',
      message:
        'The user is not authorized to upload videos. Please verify your account.',
    });

  if (!req.file) {
    return res.status(400).send('No files uploaded');
  }

  console.log(`REQUESTED THUMBNAIL`, req.thumbnailImage);
  console.log(`REACHING S3 UPLOAD VIDEO FILE`, req.file);
  try {
    // const channelId = req.user.channel; // Get channel ID from request
    const channelId = res.locals.user.channel; // Get channel ID from request
    console.log(`CHANNEL ID FROM VIDEO ROUTES:`, channelId);

    let thumbnailResult;

    const videoResult = await uploadContentToS3(req.file, channelId, 'video');
    console.log('Video uploaded:', videoResult.result);

    if (req.thumbnailImage && req.thumbnailImage.mimetype) {
      thumbnailResult = await uploadContentToS3(
        req.thumbnailImage,
        channelId,
        'thumbnail',
      );
      console.log('Thumbnail Upload Result:', thumbnailResult);
    }

    console.log(
      `getTHUMBNAIL . THUMB FUNCTION --- VIDEO UPLOAD 🔥🔥🔥🔥:`,
      req.thumbnailImage,
    );

    req.s3Data = {
      video: videoResult || null,
      thumbnail: thumbnailResult || null,
    };

    console.log(`REQUEST S3-DATA:`, req.s3Data);

    return createVideo(req, res);
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).send('File upload failed');
  }
};

module.exports = s3UploadVideo;
