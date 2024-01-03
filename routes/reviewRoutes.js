const express = require('express');
const reviewController = require('../controllers/reviewController');
// const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(reviewController.setProductIds, reviewController.createReview);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

// router.use('/:productId/review', reviewController.getProductReview); // THE "getProductReview" function is not implemented yet!

module.exports = router;
