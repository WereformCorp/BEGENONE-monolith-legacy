/**
 * @fileoverview AWS S3 upload utilities and presigned URL generation
 * @module controllers/aws_s3-controller/s3Controller
 * @layer Controller
 *
 * @description
 * Provides shared S3 integration utilities used across the application. Exports
 * three functions: uploadVideoToS3 (video-specific upload), uploadContentToS3
 * (generic content upload with content-type detection), and generatePresignedUrl
 * (generates time-limited signed GET URLs for private S3 objects). All uploads
 * use the AWS SDK v3 managed Upload class for multipart support.
 *
 * @dependencies
 * - Upstream: s3UploadVideo, s3UploadPfp, s3UploadBanner, getThumbnailData controllers
 * - Downstream: @aws-sdk/client-s3, @aws-sdk/lib-storage, @aws-sdk/s3-request-presigner
 *
 * @security
 * Requires AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, and S3_BUCKET_NAME
 * environment variables. Presigned URLs expire after 300 seconds.
 */
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

/**
 * Uploads a file buffer to S3 with a generated key following the pattern
 * `{filetype}-{channelId}-{timestamp}.{ext}`. Sets the ContentType header
 * from the file's mimetype for correct browser rendering.
 * @param {Object} file - Multer-style file object with buffer and mimetype properties
 * @param {string} channelId - Channel ID used in the S3 object key
 * @param {string} filetype - Content category prefix (e.g., 'video', 'image', 'thumbnail')
 * @returns {Promise<{result: string, key: string}>} S3 URL and object key
 */
const uploadContentToS3 = async (file, channelId, filetype) => {
  if (!file || !file.mimetype) {
    console.error('Invalid file object:', file);
    throw new Error('Invalid file object: mimetype is missing');
  }

  console.log(`UPLOAD VIDEO TO S3 FILE:`, file);
  const ext = file.mimetype.split('/')[1];
  const filename = `${filetype}-${channelId}-${Date.now().toString()}.${ext}`;

  // Determine ContentType based on fileType or mimetype
  const contentType = file.mimetype;

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: filename,
      Body: file.buffer,
      ContentType: contentType, // Set appropriate content type for each file
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

/**
 * Generates a time-limited presigned GET URL for a private S3 object.
 * URL expires after 300 seconds (5 minutes).
 * @param {string} key - S3 object key
 * @returns {Promise<string>} Presigned URL
 */
const generatePresignedUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // URL expiration time in seconds
    return url;
  } catch (err) {
    console.log(
      `S3 CONTROLLER | CHANNELS CONTROLLER | ERROR ⭕⭕⭕ | ⭕⭕⭕ Error generating pre-signed URL:`,
      err,
    );
    throw err;
  }
};

// Export the function
module.exports = {
  uploadContentToS3,
  uploadVideoToS3,
  generatePresignedUrl,
};
