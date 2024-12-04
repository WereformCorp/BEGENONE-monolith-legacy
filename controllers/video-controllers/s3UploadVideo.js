const { uploadContentToS3 } = require('../aws_s3-controller/s3Controller');
const createVideo = require('./createVideo');

const s3UploadVideo = async (req, res) => {
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

    if (req.thumbnailImage) {
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

    if (thumbnailResult) {
      req.s3Data = {
        thumbnail: thumbnailResult || undefined,
      };
    }

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
