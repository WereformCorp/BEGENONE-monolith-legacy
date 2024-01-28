const fs = require('fs');
const multer = require('multer');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const multerPhotoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationFolder =
      file.fieldname === 'photo' ? 'user-display-picture' : '';
    const userPhotoFolderPath = `public/imgs/users/${req.user._id}`;
    const finalDestination = `${userPhotoFolderPath}/${destinationFolder}`;

    // Check if the user-photo folder exists, create it if not
    if (!fs.existsSync(userPhotoFolderPath)) {
      fs.mkdirSync(userPhotoFolderPath, { recursive: true });
    }

    if (!fs.existsSync(finalDestination)) {
      fs.mkdirSync(finalDestination);
    }

    cb(null, finalDestination);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    const fieldName = file.fieldname;

    // Remove the old file before saving the new one
    if (req.user[fieldName]) {
      const oldFilePath = `public/imgs/users/${req.user._id}/user-display-picture/${req.user[fieldName]}`;
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    cb(null, `${fieldName}-${req.user._id}-${Date.now()}.${ext}`);
  },
});

const multerPhotoFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError(`Not an image! Please upload only images.`, 400), false);
  }
};

const uploadPhoto = multer({
  storage: multerPhotoStorage,
  fileFilter: multerPhotoFilter,
});

exports.uploadUserPhoto = uploadPhoto.single('photo');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().populate({
    path: 'channel',
    select: '-__v',
  });

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
  const user = await User.findById(req.params.id).populate({
    path: 'channel',
    select: '-__v',
  });

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

exports.me = catchAsync(async (req, res, next) => {
  const me = await User.findById(req.user._id).select(
    '-eAddress.password -eAddress.phoneNumber',
  );
  if (!me)
    return next(
      new AppError(`ME is lost. Can't find. Create One and maybe you'll find.`),
    );

  return res.status(200).json({
    status: 'Success',
    data: me,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file);

  // 1) Create error if user posts password data
  const sensitiveFields = ['password', 'passwordConfirm', 'phoneNumber'];
  const hasSensitiveField = sensitiveFields.some(
    (field) => req.body.eAddress && req.body.eAddress[field] !== undefined,
  );

  if (hasSensitiveField) {
    return next(
      new AppError(
        `This route is not for password updates. Please use /updateMyPassword`,
        400,
      ),
    );
  }

  const me = await User.findById(req.user._id);
  const userData = { ...req.body };
  // userData.password = me.eAddress.password;

  // userData = me;
  console.log(me);

  // 3) Update User document
  let updatedUser = await User.findByIdAndUpdate(req.user._id, userData, {
    new: true,
  });

  // updatedUser = await User.findByIdAndUpdate(
  //   req.user._id,
  //   {
  //     password: me.password,
  //     passwordConfirm: me.passwordConfirm,
  //     passwordChangedAt: me.passwordChangedAt,
  //     phoneNumber: me.phoneNumber,
  //   },
  //   { new: true },
  // );

  // if (req.file) updatedUser.photo = req.file.filename;

  if (req.file) {
    updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { photo: req.file.filename },
      { new: true },
    );
  }
  console.log(updatedUser.photo);

  return res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'Success',
    data: null,
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'Success',
    message:
      'This route is not yet defined, in case you want to sign up, Use this route instead: /signup',
  });
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
