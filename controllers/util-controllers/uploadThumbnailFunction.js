const uploadThumbnailFunction = (req, res, next) => {
  if (req.file) {
    console.log(`Uploaded Thumbnail File:`, req.file);
    req.thumbnail = req.file; // Attach file to req for downstream use
  } else {
    console.log('No thumbnail uploaded.');
    req.thumbnail = null; // Handle case when no file is uploaded
  }
  next(); // Pass control to the next handler
};

module.exports = uploadThumbnailFunction;
