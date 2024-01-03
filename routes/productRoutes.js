const express = require('express');
const productController = require('../controllers/productController');
const reviewRouter = require('./reviewRoutes');
// const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(productController.getAllProducts)
  .post(productController.setChannelIds, productController.createProduct);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

router.use('/:productId/review', reviewRouter);

module.exports = router;
