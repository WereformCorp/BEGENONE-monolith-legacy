// const multer = require('multer');
// // eslint-disable-next-line import/no-extraneous-dependencies
// const AWS = require('aws-sdk');
// // eslint-disable-next-line import/no-extraneous-dependencies
// const multerS3 = require('multer-s3');

// const AppError = require('../utils/appError');

// // Configure AWS SDK with your credentials and region
// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION, // e.g., 'us-west-2'
// });

// // Create an S3 instance
// const s3 = new AWS.S3();

// // Configure Multer to use S3 for storage
// let upload;
// (() => {
//   try {
//     upload = multer({
//       storage: multerS3({
//         s3: s3,
//         bucket: process.env.S3_BUCKET_NAME, // your S3 bucket name
//         metadata: function (req, file, cb) {
//           cb(null, { fieldName: file.fieldname });
//         },
//         key: function (req, file, cb) {
//           cb(null, `${Date.now().toString()}-${file.originalname}`);
//         },
//       }),
//     });
//   } catch (err) {
//     console.log(err);
//     return new AppError(err);
//   }
// })();

// console.log(upload);

// exports.uploadVidFile = upload.single('video');

// ///////////////////_________________________________________________ NEW VERSION

// eslint-disable-next-line import/no-extraneous-dependencies, node/no-extraneous-require
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
// eslint-disable-next-line import/no-extraneous-dependencies, node/no-extraneous-require
const { Upload } = require('@aws-sdk/lib-storage');

// eslint-disable-next-line import/no-extraneous-dependencies
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Initialize the S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// File upload function
const uploadVideoToS3 = async (file, channelId) => {
  const ext = file.mimetype.split('/')[1];
  const filename = `video-${channelId}-${Date.now().toString()}.${ext}`;
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: filename,
      Body: file.buffer,
    },
  });

  try {
    const result = await upload.done();
    console.log(`RESULTS FROM AWS_S3_CONTROLLER:`, result.Location);
    // return result;
    return {
      result: result.Location, // S3 URL
      key: filename, // Filename used in S3
    };
  } catch (error) {
    console.error('Upload Error:', error);
    throw error;
  }
};

// const uploadFileToS3 = async (file, channelId, fileType) => {
//   const ext = file.mimetype.split('/')[1];
//   const filename = `${fileType}-${channelId}-${Date.now().toString()}.${ext}`;

//   // Determine ContentType based on fileType or mimetype
//   const contentType = fileType === 'thumbnail' ? 'image/jpeg' : file.mimetype;

//   const upload = new Upload({
//     client: s3Client,
//     params: {
//       Bucket: process.env.S3_BUCKET_NAME,
//       Key: filename,
//       Body: file.buffer,
//       ContentType: contentType, // Set appropriate content type for each file
//     },
//   });

//   try {
//     const result = await upload.done();
//     console.log(`RESULTS FROM AWS_S3_CONTROLLER:`, result.Location);
//     // return result;
//     return {
//       result: result.Location, // S3 URL
//       key: filename, // Filename used in S3
//     };
//   } catch (error) {
//     console.error('Upload Error:', error);
//     throw error;
//   }
// };

// const streamVideoFromS3 = async (videoKey, res) => {
//   try {
//     const command = new GetObjectCommand({
//       Bucket: process.env.S3_BUCKET_NAME,
//       Key: videoKey, // The key (filename) of the video in S3
//     });

//     const { Body, ContentLength, ContentType } = await s3Client.send(command);

//     res.writeHead(200, {
//       'Content-Type': ContentType || 'video/mp4', // Adjust according to your video type
//       'Content-Length': ContentLength,
//     });

//     Body.pipe(res);
//   } catch (error) {
//     console.error('Error streaming video:', error);
//     res.status(500).send('Error streaming video');
//   }
// };

const generatePresignedUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // URL expiration time in seconds
    return url;
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    throw error;
  }
};

// Export the function
module.exports = {
  uploadVideoToS3,
  //  streamVideoFromS3,
  generatePresignedUrl,
};
