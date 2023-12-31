const express = require('express');
const storyController = require('../controllers/storyController');
// const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(storyController.getAllStories)
  .post(storyController.createStory);

router
  .route('/:id')
  .get(storyController.getStory)
  .patch(storyController.updateStory)
  .delete(storyController.deleteStory);

module.exports = router;
