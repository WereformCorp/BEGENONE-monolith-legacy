// // const mongoose = require('mongoose');
// // const Video = require('../models/videoModel');
// const AppError = require('../utils/appError');
// const catchAsync = require('../utils/catchAsync');

// exports.getAll = (Model) =>
//   catchAsync(async (req, res, next) => {
//     try {
//       const data = await Model.find({});
//       if (!data)
//         return next(
//           new AppError(`Data you are looking for, do not exist.`, 404),
//         );
//       return res.status(200).json({
//         status: 'Success',
//         results: data.length,
//         data,
//       });
//     } catch (err) {
//       return res.status(404).json({
//         status: 'fail',
//         message: err.message,
//         err,
//       });
//     }
//   });

// exports.getOne = (Model) =>
//   catchAsync(async (req, res, next) => {
//     try {
//       const data = await Model.findById(req.params.id);
//       if (!data)
//         return next(
//           new AppError(`Data you are looking for, do not exist.`, 404),
//         );

//       return res.status(200).json({
//         status: 'Success',
//         data,
//       });
//     } catch (err) {
//       return res.status(404).json({
//         status: 'fail',
//         message: err.message,
//         err,
//       });
//     }
//   });

// exports.updateOne = (Model) =>
//   catchAsync(async (req, res, next) => {
//     try {
//       const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//       });

//       if (!data)
//         return next(
//           new AppError(`Data you are looking for, do not exist.`, 404),
//         );

//       return res.status(200).json({
//         status: 'Success',
//         data,
//       });
//     } catch (err) {
//       return res.status(404).json({
//         status: 'fail',
//         message: err.message,
//         err,
//       });
//     }
//   });

// exports.deleteOne = (Model) =>
//   catchAsync(async (req, res, next) => {
//     try {
//       const data = await Model.findByIdAndDelete(req.params.id);

//       return res.status(204).json({
//         status: 'success',
//         data,
//       });
//     } catch (err) {
//       return res.status(404).json({
//         status: 'fail',
//         message: err.message,
//         err,
//       });
//     }
//   });
