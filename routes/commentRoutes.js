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
