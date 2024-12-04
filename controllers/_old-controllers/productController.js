// const mongoose = require('mongoose');
// const Product = require('../models/productModel');
// const Channel = require('../models/channelModel');
// const AppError = require('../utils/appError');
// const catchAsync = require('../utils/catchAsync');
// const factory = require('./handlerController');

// exports.setChannelIds = (req, res, next) => {
//   if (!req.body.channel) req.body.channel = req.params.channelId;
//   if (!mongoose.Types.ObjectId.isValid(req.body.channel))
//     return next(new AppError('Invalid channel ID', 400));
//   next();
// };
// exports.getAllProducts = factory.getAll(Product);
// exports.getProduct = factory.getOne(Product);
// exports.updateProduct = factory.updateOne(Product);
// exports.deleteProduct = factory.deleteOne(Product);
// exports.createProduct = catchAsync(async (req, res, next) => {
//   try {
//     const productData = await Product.create({
//       title: req.body.title,
//       description: req.body.description,
//       thumbnail: req.body.thumbnail,
//       specification: {
//         gallery: req.body.specification.gallery,
//       },
//       price: req.body.price,
//       channel: req.user.channel._id,
//       reviews: req.body.reviews,
//     });

//     await Channel.findByIdAndUpdate(
//       req.user.channel._id,
//       { $push: { products: productData._id } },
//       { new: true, select: '_id' },
//     );

//     if (!productData)
//       Channel.findByIdAndUpdate(req.user.channel._id, { products: [] });

//     if (!productData) next(new AppError(`Data Not Found!`, 404));

//     if (productData)
//       return res.status(201).json({
//         status: 'Success',
//         data: productData,
//       });
//   } catch (err) {
//     res.json({
//       status: 'fail',
//       message: err.message,
//       err,
//     });
//   }
// });
