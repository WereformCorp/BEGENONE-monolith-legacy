/**
 * @fileoverview Channel creation with subscription and pricing feature validation
 * @module controllers/channel-controllers/createChannel
 * @layer Controller
 *
 * @description
 * Creates a new Channel document for the authenticated user after verifying that
 * the user holds an active subscription whose pricing tier enables channel creation.
 * Prevents duplicate channels per user. After creation, links the channel back to
 * the User document and aggregates sponsor and comment references from existing videos.
 *
 * @dependencies
 * - Upstream: channel route handler (authenticated)
 * - Downstream: Channel model, User model, Video model, Subscription model, Pricing model, AppError, catchAsync
 *
 * @security Requires active subscription with channelCreation feature enabled.
 */
const Channel = require('../../models/channelModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const User = require('../../models/userModel');
const Video = require('../../models/videoModel');
const Subscription = require('../../models/subscriptionModel');
const Pricing = require('../../models/pricingModel');

const createChannel = catchAsync(async (req, res, next) => {
  try {
    // Step 1: Get the current user
    const user = await User.findById(req.user._id).populate(
      'currentActiveSubscription',
    );

    console.log(`USER FROM CREATE CHANNEL:`, user);

    if (!user || !user.currentActiveSubscription) {
      return res.status(400).json({
        status: 'Failed',
        message: `No active subscription found. Please purchase a subscription to create a channel.`,
      });
    }

    // Step 2: Fetch the subscription based on currentActiveSubscription
    const subscription = await Subscription.findById(
      user.currentActiveSubscription,
    );

    console.log(`SUBSCRIPTION FROM CREATE CHANNEL:`, subscription);

    if (!subscription) {
      return res.status(400).json({
        status: 'Failed',
        message: `Subscription associated with user is invalid or not found.`,
      });
    }

    // Step 3: Fetch the pricing details associated with the subscription
    const pricing = await Pricing.findById(subscription.pricings);

    console.log(`PRICING FROM CREATE CHANNEL:`, pricing);

    if (!pricing) {
      return res.status(400).json({
        status: 'Failed',
        message: `Pricing details for the subscription are missing.`,
      });
    }
    if (
      subscription.active === true &&
      subscription.status === 'active' &&
      pricing.features.get('channelCreation') === true
    ) {
      // return console.log(`Subscription By Current User`, subscription);
      console.log(
        `USER IS ELIGIBLE TO CREATE A CHANNEL [BECAUSE HE HAS PURCHASED THE EARLY ACCESS SUBSCRIPTION]`,
        { Subscription_ACTIVE: subscription.active },
        { Subscription_STATUS: subscription.status },
      );
      const existingChannel = await Channel.findOne({ user: req.user._id });

      if (existingChannel) {
        // If a channel already exists, send an error response
        return res.status(400).json({
          status: 'fail',
          message: 'User already has a channel.',
        });
      }

      const channelData = await Channel.create({
        channelUserName: req.body.channelUserName,
        name: req.body.name,
        displayImage: req.body.displayImage,
        bannerImage: req.body.bannerImage,
        about: req.body.about,
        subscribers: req.body.subscribers,
        products: req.body.products,
        reviews: req.body.reviews,
        commentToggle: req.body.commentToggle,
        comments: req.body.comments,
        commentFilters: req.body.commentFilters,
        videos: req.body.videos,
        wires: req.body.wires,
        user: req.user._id,
        sponsors: req.body.sponsors,
        story: req.body.story,
      });

      if (!channelData.displayImage)
        channelData.displayImage = '/imgs/users/default.jpeg';

      await User.findByIdAndUpdate(
        req.user._id,
        { channel: channelData._id },
        { new: true },
      );

      if (!channelData)
        await User.findByIdAndUpdate(req.user._id, { channel: [] });

      const videos = await Video.find({ _id: { $in: channelData.videos } });
      // const sponsorsId = videos.sponsors;
      const sponsorsId = videos.reduce(
        (acc, video) => acc.concat(video.sponsors),
        [],
      );

      const commentId = videos.reduce(
        (acc, video) => acc.concat(video.comments),
        [],
      );

      await Channel.findByIdAndUpdate(
        channelData._id,
        { sponsors: sponsorsId._id, comments: commentId._id },
        { new: true, select: '_id' },
      );

      if (!channelData)
        await Channel.findByIdAndUpdate(channelData._id, { sponsors: [] });

      if (!channelData) return next(new AppError(`Data Not Found!`, 404));
      // if (!channelData.section) channelData.section = [];

      return res.status(201).json({
        status: 'Success',
        data: channelData,
      });
    }
    console.log(
      `⭕⭕⭕ You Cannot Create Channel, You'd need to Purchase Early Access to Get Started. ⭕⭕⭕`,
    );
    res.status(400).json({
      status: 'failed',
      message: `You Cannot Create Channel, You'd need to Purchase Early Access to Get Started.`,
    });
  } catch (err) {
    console.log(`CREATE CHANNEL | CHANNELS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = createChannel;
