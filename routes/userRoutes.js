/**
 * @fileoverview User authentication and account management route definitions.
 * @module routes/userRoutes
 * @layer Route
 * @basepath /api/v1/users
 *
 * @description
 * Registers public endpoints for signup, login, logout, email verification, password
 * reset flows, and existence checks. Protected endpoints handle profile retrieval (me),
 * password update, self-update, and self-delete. Administrative CRUD routes for user
 * management are mounted without role-restriction middleware at present.
 *
 * Middleware chain: individual routes apply the protect middleware for authenticated
 * access; public auth routes (signup, login, forgot/reset password) have no guard.
 *
 * @dependencies
 * - Upstream: app.js (mounted at /api/v1/users)
 * - Downstream: controllers/auth-controllers/*, controllers/user-controllers/*, controllers/util-controllers/checkEmailUsernameExistence
 */

const express = require('express');
// const userController = require('../controllers/userController');
// const authController = require('../controllers/authController');
const {
  signup,
  signupAuth,
} = require('../controllers/auth-controllers/signup');
const {
  verifySignupToken,
  resendVerificationLink,
} = require('../controllers/auth-controllers/verificationToken');
const login = require('../controllers/auth-controllers/login');
const logout = require('../controllers/auth-controllers/logout');
const forgotPassword = require('../controllers/auth-controllers/forgotPassword');
const resetPassword = require('../controllers/auth-controllers/resetPassword');
const protect = require('../controllers/auth-controllers/protect');
const me = require('../controllers/user-controllers/getMe');
const checkEmailUsernameExistence = require('../controllers/util-controllers/checkEmailUsernameExistence');
const updatePassword = require('../controllers/auth-controllers/updatePassword');
const updateMe = require('../controllers/user-controllers/updateMe');
const deleteMe = require('../controllers/user-controllers/deleteMe');
const getAllUsers = require('../controllers/user-controllers/getAllUsers');
const getUser = require('../controllers/user-controllers/getUser');
const updateUser = require('../controllers/user-controllers/updateUser');
const deleteUser = require('../controllers/user-controllers/deleteUser');
// const viewsController = require('../controllers/viewsController');

const router = express.Router({ mergeParams: true });

router.post('/check-existence', checkEmailUsernameExistence);

router.post('/resend-verification', resendVerificationLink);
router.post('/signup', signup, signupAuth);
router.patch('/verifyEmail/:token', verifySignupToken);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.get('/me', protect, me);

router.patch('/updateMyPassword', protect, updatePassword);

router.patch('/updateMe', protect, updateMe);

router.delete('/deleteMe', deleteMe);

router.route('/').get(getAllUsers);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
