const mongoose = require('mongoose');
const Product = require('../models/productModel');
const Channel = require('../models/channelModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.setChannelIds = (req, res, next) => {
  if (!req.body.channel) req.body.channel = req.params.channelId;

  console.log(req.body.channel);

  if (!mongoose.Types.ObjectId.isValid(req.body.channel)) {
    return next(new AppError('Invalid channel ID', 400));
  }

  next();
};

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
      channel: req.params.channelId,
      reviews: req.body.reviews,
    });

    await Channel.findByIdAndUpdate(
      req.params.channelId,
      { $push: { products: productData._id } },
      { new: true, select: '_id' },
    );

    if (!productData)
      Channel.findByIdAndUpdate(req.params.channelId, { products: [] });

    if (!productData) next(new AppError(`Data Not Found!`, 404));

    if (productData)
      return res.status(201).json({
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
