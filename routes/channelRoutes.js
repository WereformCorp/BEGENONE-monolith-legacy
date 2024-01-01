const express = require('express');
const channelController = require('../controllers/channelController');
// const authController = require('../controllers/authController');
const videoRouter = require('./videoRoutes');
const storyRouter = require('./storyRoutes');
const productRouter = require('./productRoutes');
const sponsorRouter = require('./sponsorRoutes');
const discussionRouter = require('./discussionRoutes');
const reviewRouter = require('./reviewRoutes');
const commentRouter = require('./commentRoutes');
const userRouter = require('./userRoutes');

const router = express.Router();

router
  .route('/')
  .get(channelController.getAllChannels)
  .post(channelController.createChannel);

router
  .route('/:id')
  .get(channelController.getChannel)
  .patch(channelController.updateChannel)
  .delete(channelController.deleteChannel);

router.use('/:channelId/video', videoRouter);
router.use('/:channelId/story', storyRouter);
router.use('/:channelId/product', productRouter);
router.use('/:channelId/sponsor', sponsorRouter);
router.use('/:channelId/discussion', discussionRouter);

router.use('/:channelId/products/:productsId/reviews', reviewRouter);
router.use('/:channelId/products/:videoId/comments', commentRouter);

router.use('/user', userRouter);

module.exports = router;
