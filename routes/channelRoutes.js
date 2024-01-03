const express = require('express');
const channelController = require('../controllers/channelController');
// getChannel = require('../controllers/getChannel');
// const authController = require('../controllers/authController');
const videoRouter = require('./videoRoutes');
const storyRouter = require('./storyRoutes');
const productRouter = require('./productRoutes');
const wireRouter = require('./wireRoutes');
// const sponsorRouter = require('./sponsorRoutes');
// const reviewRouter = require('./reviewRoutes');
// const commentRouter = require('./commentRoutes');
const userRouter = require('./userRoutes');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(channelController.getAllChannels)
  .post(channelController.createChannel);

router
  .route('/:id')
  .get(channelController.getChannel)
  .patch(channelController.updateChannel)
  .delete(channelController.deleteChannel);

router.use('/:channelId/video', videoRouter); // SUCCESS !!! 👍
router.use('/:channelId/story', storyRouter);
router.use('/:channelId/product', productRouter);
// router.use('/:channelId/sponsor', sponsorRouter); // SUCCESS !!! 👍
router.use('/:channelId/wire', wireRouter); // SUCCESS !!! 👍

// router.use('/:channelId/reviews', reviewRouter);
// router.use('/:channelId/comments', commentRouter);

router.use('/user', userRouter);

module.exports = router;
