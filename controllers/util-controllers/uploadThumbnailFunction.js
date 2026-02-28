/**
 * @fileoverview Thumbnail file attachment middleware
 * @module controllers/util-controllers/uploadThumbnailFunction
 * @layer Middleware
 *
 * @description
 * Inspects req.file (populated by an upstream multer or similar file-upload
 * middleware) and attaches it to req.thumbnail for downstream handlers. Sets
 * req.thumbnail to null when no file is present, ensuring a consistent
 * interface for subsequent middleware.
 *
 * @dependencies
 * - Upstream: File-upload middleware (e.g., multer), video/content creation routes
 * - Downstream: None (populates req.thumbnail for downstream handlers)
 */
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
