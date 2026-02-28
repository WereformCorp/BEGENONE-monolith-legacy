/**
 * @fileoverview Comment CRUD route definitions with merge-params support from parent video route.
 * @module routes/commentRoutes
 * @layer Route
 * @basepath /api/v1/videos/:videoId/comments (nested) or /api/v1/comments (direct)
 *
 * @description
 * Registers endpoints for listing, creating, retrieving, updating, and deleting
 * comments. This router is instantiated with mergeParams: true, allowing it to
 * inherit :videoId from the parent videoRoutes mount. Also exposes a template
 * rendering endpoint via the pugController.
 *
 * Middleware chain: protect guards create, update, and delete operations;
 * read operations are public.
 *
 * @dependencies
 * - Upstream: routes/videoRoutes (nested mount at /:videoId/comments), app.js
 * - Downstream: controllers/comment-controllers/*, controllers/auth-controllers/protect, controllers/util-controllers/pugController
 */

const express = require('express');
// const commentController = require('../controllers/commentController');
// const authController = require('../controllers/authController');
const getAllComments = require('../controllers/comment-controllers/getAllComments');
const protect = require('../controllers/auth-controllers/protect');
const createComment = require('../controllers/comment-controllers/createComment');
const templify = require('../controllers/util-controllers/pugController');
const getComment = require('../controllers/comment-controllers/getComment');
const updateComment = require('../controllers/comment-controllers/updateComment');
const deleteComment = require('../controllers/comment-controllers/deleteComment');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    // commentController.getAllComments
    getAllComments,
  )
  .post(
    // authController.protect,
    // commentController.createComment,
    protect,
    createComment,
  );

router.route('/:template').post(
  // commentController.templify
  templify,
);

// module.exports = router;

router
  .route('/:id')
  .get(
    // commentController.getComment,
    getComment,
  )
  .patch(protect, updateComment)
  .delete(protect, deleteComment);

module.exports = router;
