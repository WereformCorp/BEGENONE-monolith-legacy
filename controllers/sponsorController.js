const Sponsor = require('../models/sponsorsModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllSponsors = catchAsync(async (req, res, next) => {
  const sponsors = await Sponsor.find();

  if (!sponsors) next(new AppError(`Sponsors Not Found!`, 404));

  res.status(200).json({
    status: 'Success',
    results: sponsors.length,
    sponsors,
  });
});

exports.getSponsor = catchAsync(async (req, res, next) => {
  const sponsors = await Sponsor.findById(req.params.id);

  if (!sponsors) next(new AppError(`Product Not Found!`, 404));

  res.status(200).json({
    status: 'Success',
    sponsors,
  });
});

exports.updateSponsor = catchAsync(async (req, res, next) => {
  try {
    const sponsors = await Sponsor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!sponsors) {
      return next(new AppError('No document Found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      sponsors,
    });
  } catch (err) {
    console.log(err, err.message);
  }
});

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
    });

    if (!sponsorData) next(new AppError(`Data Not Found!`, 404));

    res.status(201).json({
      status: 'Success',
      data: sponsorData,
    });
  } catch (err) {
    console.log(err, err.message);
  }
});

exports.deleteSponsor = catchAsync(async (req, res, next) => {
  try {
    const sponsors = await Sponsor.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'Success',
      sponsors,
    });
  } catch (err) {
    console.log(err, err.message);
  }
});
