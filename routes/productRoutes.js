const express = require('express');
const productController = require('../controllers/productController');
const reviewRouter = require('./reviewRoutes');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(productController.getAllProducts)
  .post(authController.protect, productController.createProduct);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(authController.protect, productController.updateProduct)
  .delete(authController.protect, productController.deleteProduct);

router.use('/:productId/review', reviewRouter);

module.exports = router;
