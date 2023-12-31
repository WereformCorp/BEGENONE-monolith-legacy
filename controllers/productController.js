const Product = require('../models/productModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();

  if (!products) next(new AppError(`Products Not Found!`, 404));

  res.status(200).json({
    status: 'Success',
    results: products.length,
    products,
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const products = await Product.findById(req.params.id);

  if (!products) next(new AppError(`Product Not Found!`, 404));

  res.status(200).json({
    status: 'Success',
    products,
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  try {
    const products = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!products) {
      return next(new AppError('No document Found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      products,
    });
  } catch (err) {
    console.log(err, err.message);
  }
});

exports.createProduct = catchAsync(async (req, res, next) => {
  try {
    const productData = await Product.create({
      title: req.body.title,
      description: req.body.description,
      thumbnail: req.body.thumbnail,
      specification: {
        gallery: req.body.specification.gallery,
      },
      price: req.body.price,
    });

    if (!productData) next(new AppError(`Data Not Found!`, 404));

    res.status(201).json({
      status: 'Success',
      data: productData,
    });
  } catch (err) {
    console.log(err, err.message);
  }
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  try {
    const products = await Product.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'Success',
      products,
    });
  } catch (err) {
    console.log(err, err.message);
  }
});
