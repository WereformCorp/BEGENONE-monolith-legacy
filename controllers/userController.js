const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  if (!users) return next(new AppError(`Users Not Found!`, 404));

  res.status(200).json({
    status: 'Success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) next(new AppError(`User Not Found!`, 404));

  res.status(200).json({
    status: 'Success',
    user,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!user) {
      return next(new AppError('No document Found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      user,
    });
  } catch (err) {
    console.log(err, err.message);
  }
});

exports.createUser = catchAsync(async (req, res, next) => {
  try {
    const userData = await User.create({
      name: {
        firstName: req.body.name.firstName,
        secondName: req.body.name.secondName,
      },
      displayImage: req.body.displayImage,
      username: req.body.username,
      displayName: req.body.displayName,
      eAddress: {
        phoneNumber: req.body.eAddress.phoneNumber,
        email: req.body.eAddress.email,
        password: req.body.eAddress.password,
        passwordConfirm: req.body.eAddress.passwordConfirm,
      },
      lockAccount: {
        numeric: req.body.lockAccount.numeric,
        alphabetic: req.body.lockAccount.alphabetic,
      },
      platformSettings: {
        mode: req.body.platformSettings.mode,
        languages: req.body.platformSettings.languages,
        gui: req.body.platformSettings.gui,
        ux: {
          scroll: req.body.platformSettings.ux.scroll,
          popUp: req.body.platformSettings.ux.popUp,
          cookies: req.body.platformSettings.ux.cookies,
        },
      },
    });

    if (!userData) return next(new AppError(`Data Not Found!`, 404));

    res.status(201).json({
      status: 'Success',
      data: userData,
    });
  } catch (err) {
    console.log(err, err.message);
  }
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'Success',
      user,
    });
  } catch (err) {
    console.log(err, err.message);
  }
});
