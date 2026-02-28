/**
 * @fileoverview Admin hard-delete user controller
 * @module controllers/user-controllers/deleteUser
 * @layer Controller
 *
 * @description
 * Permanently removes a user document from the database by ID. This is a
 * destructive operation intended for administrative use; the document
 * cannot be recovered after deletion.
 *
 * @dependencies
 * - Upstream: User route (DELETE /users/:id), typically admin-restricted
 * - Downstream: User model, catchAsync
 */
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');

const deleteUser = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'Success',
      user,
    });
  } catch (err) {
    console.log(`DELETE USERS | USER CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = deleteUser;
