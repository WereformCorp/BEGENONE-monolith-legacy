const multer = require('multer');
// const sharp = require('sharp');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/imgs/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError(`Not an image! Please upload only images.`, 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

// exports.uploadTourImages = upload.fields([
//   { name: 'imageCover', maxCount: 1 },
//   { name: 'images', maxCount: 3 },
// ]);

// upload.single('image'); // req.file
// upload.array('images', 5); // req.files

// exports.resizeTourImages = catchAsync(async (req, res, next) => {
//   if (!req.files.imageCover || !req.files.images) return next();

//   // 1) COVER IMAGE
//   req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
//   await sharp(req.files.imageCover[0].buffer)
//     .resize(2000, 1333)
//     .toFormat('jpeg')
//     .jpeg({ quality: 90 })
//     .toFile(`public/img/tours/${req.body.imageCover}`);

//   req.body.images = [];
//   // 2) IMAGES
//   await Promise.all(
//     req.files.images.map(async (file, i) => {
//       const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

//       await sharp(file.buffer)
//         .resize(2000, 1333)
//         .toFormat('jpeg')
//         .jpeg({ quality: 90 })
//         .toFile(`public/img/tours/${filename}`);

//       req.body.images.push(filename);
//     }),
//   );

//   next();
// });

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

  // 3) Update User document
  const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  });
  if (req.file) updatedUser.photo = req.file.filename;
  // console.log(updatedUser.photo);

  res.status(200).json({
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
