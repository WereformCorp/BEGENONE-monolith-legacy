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
