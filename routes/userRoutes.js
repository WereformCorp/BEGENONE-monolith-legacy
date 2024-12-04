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
const updatePassword = require('../controllers/auth-controllers/updatePassword');
const updateMe = require('../controllers/user-controllers/updateMe');
const deleteMe = require('../controllers/user-controllers/deleteMe');
const getAllUsers = require('../controllers/user-controllers/getAllUsers');
const getUser = require('../controllers/user-controllers/getUser');
const updateUser = require('../controllers/user-controllers/updateUser');
const deleteUser = require('../controllers/user-controllers/deleteUser');
// const viewsController = require('../controllers/viewsController');

const router = express.Router({ mergeParams: true });

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
