// const express = require('express');
// const productController = require('../controllers/productController');
// const reviewRouter = require('./reviewRoutes');
// const authController = require('../controllers/authController');
// const protect = require('../controllers/auth-controllers/protect');

// const router = express.Router({ mergeParams: true });

// router
//   .route('/')
//   .get(productController.getAllProducts)
//   .post(protect, productController.createProduct);

// router
//   .route('/:id')
//   .get(productController.getProduct)
//   .patch(protect, productController.updateProduct)
//   .delete(protect, productController.deleteProduct);

// router.use('/:productId/review', reviewRouter);

// module.exports = router;
