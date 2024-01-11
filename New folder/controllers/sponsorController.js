const mongoose = require('mongoose');
const Sponsor = require('../models/sponsorsModel');
const Video = require('../models/videoModel');
const Channel = require('../models/channelModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerController');

exports.setVideoIds = (req, res, next) => {
  if (!req.body.video) req.body.video = req.params.videoId;
  if (!mongoose.Types.ObjectId.isValid(req.body.video))
    return next(new AppError('Invalid Video ID', 400));
  next();
};

exports.getAllSponsors = factory.getAll(Sponsor);
exports.getSponsor = factory.getOne(Sponsor);
exports.updateSponsor = factory.updateOne(Sponsor);
exports.deleteSponsor = factory.deleteOne(Sponsor);

// exports.getAllSponsors = catchAsync(async (req, res, next) => {
//   const sponsors = await Sponsor.find();

//   if (!sponsors) next(new AppError(`Sponsors Not Found!`, 404));

//   res.status(200).json({
//     status: 'Success',
//     results: sponsors.length,
//     sponsors,
//   });
// });

// exports.getSponsor = catchAsync(async (req, res, next) => {
//   const sponsors = await Sponsor.findById(req.params.id);

//   if (!sponsors) next(new AppError(`Product Not Found!`, 404));

//   res.status(200).json({
//     status: 'Success',
//     sponsors,
//   });
// });

// exports.updateSponsor = catchAsync(async (req, res, next) => {
//   try {
//     const sponsors = await Sponsor.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });

//     if (!sponsors) {
//       return next(new AppError('No document Found with that ID', 404));
//     }

//     res.status(200).json({
//       status: 'success',
//       sponsors,
//     });
//   } catch (err) {
//     console.log(err, err.message);
//   }
// });

exports.createSponsor = catchAsync(async (req, res, next) => {
  try {
    const sponsorData = await Sponsor.create({
      companyLogo: req.body.companyLogo,
      companyName: req.body.companyName,
      productName: req.body.productName,
      productDescription: req.body.productDescription,
      gallery: req.body.gallery,
      companyWebsite: req.body.companyWebsite,
      productWebsite: req.body.productWebsite,
      productPromoCode: req.body.productPromoCode,
      messageAdOwner: req.body.messageAdOwner,
      messageContentCreator: req.body.messageContentCreator,
      video: req.params.videoId,
    });

    if (!(await Video.findById(req.params.videoId)))
      return next(new AppError(`Video Not Found!`, 404));

    await Video.findByIdAndUpdate(
      req.params.videoId,
      { sponsors: sponsorData._id },
      { new: true },
    );

    if (!sponsorData)
      Channel.findByIdAndUpdate(req.params.videoId, { sponsors: [] });

    const video = await Video.findById(req.params.videoId);
    await Channel.findByIdAndUpdate(
      video.channel._id,
      { sponsors: sponsorData._id },
      { new: true, select: '_id' },
    );

    if (!sponsorData)
      Channel.findByIdAndUpdate(video.channel._id, { sponsors: [] });

    if (!sponsorData) next(new AppError(`Data Not Found!`, 404));

    return res.status(201).json({
      status: 'Success',
      data: sponsorData,
    });
  } catch (err) {
    return res.json({
      status: 'fail',
      message: err.message,
      err,
    });
  }
});

// exports.deleteSponsor = catchAsync(async (req, res, next) => {
//   try {
//     const sponsors = await Sponsor.findByIdAndDelete(req.params.id);

//     res.status(204).json({
//       status: 'Success',
//       sponsors,
//     });
//   } catch (err) {
//     console.log(err, err.message);
//   }
// });
