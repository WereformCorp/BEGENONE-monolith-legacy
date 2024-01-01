const express = require('express');
const discussionController = require('../controllers/discussionController');
const commentRouter = require('./commentRoutes');
const sponsorRouter = require('./sponsorRoutes');
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

router.use('/:discussionId/comments', commentRouter);
router.use('/:discussionId/discussion/sponsors', sponsorRouter);

module.exports = router;
