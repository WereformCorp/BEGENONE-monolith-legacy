/**
 * @fileoverview Comment listing endpoint
 * @module controllers/comment-controllers/getAllComments
 * @layer Controller
 *
 * @description
 * Retrieves all Comment documents from the database and returns them
 * with a result count in the JSON response.
 *
 * @dependencies
 * - Upstream: comment route handler
 * - Downstream: Comment model, AppError, catchAsync
 */
const Comment = require('../../models/commentModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

const getAllComments = catchAsync(async (req, res, next) => {
  try {
    const data = await Comment.find({});
    if (!data)
      return next(new AppError(`Data you are looking for, do not exist.`, 404));
    return res.status(200).json({
      status: 'Success',
      results: data.length,
      data,
    });
  } catch (err) {
    console.log(`GET ALL COMMENTS | COMMENTS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = getAllComments;
