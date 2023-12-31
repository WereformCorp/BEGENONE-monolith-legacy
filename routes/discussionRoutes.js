const express = require('express');
const discussionController = require('../controllers/discussionController');
// const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(discussionController.getAllDiscussions)
  .post(discussionController.createDiscussion);

router
  .route('/:id')
  .get(discussionController.getDiscussion)
  .patch(discussionController.updateDiscussion)
  .delete(discussionController.deleteDiscussion);

module.exports = router;
