// // const mongoose = require('mongoose');
// const Wire = require('../models/wireModel');
// const Channel = require('../models/channelModel');
// const AppError = require('../utils/appError');
// const catchAsync = require('../utils/catchAsync');
// const factory = require('./handlerController');

// exports.getAllWires = factory.getAll(Wire);
// exports.getWire = factory.getOne(Wire);
// exports.updateWire = factory.updateOne(Wire);
// exports.deleteWire = factory.deleteOne(Wire);
// exports.createWire = catchAsync(async (req, res, next) => {
//   try {
//     const wireData = await Wire.create({
//       heading: req.body.heading,
//       subHeading: req.body.subHeading,
//       bookmark: req.body.bookmark,
//       wireText: req.body.wireText,
//     });

//     await Channel.findByIdAndUpdate(
//       req.user.channel._id,
//       { $push: { wires: [wireData._id] } },
//       { new: true },
//     );

//     if (!wireData)
//       await Channel.findByIdAndUpdate(req.user.channel._id, { wires: [] });

//     if (!wireData) return next(new AppError(`Data Not Found!`, 404));

//     res.status(201).json({
//       status: 'success',
//       data: wireData,
//     });
//   } catch (err) {
//     console.log(err, err.message);
//     return res.status(500).json({
//       status: 'Error',
//       message: `Error creating Wire: ${err.message}`,
//     });
//   }
// });
