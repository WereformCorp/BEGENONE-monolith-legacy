const Channel = require('../../models/channelModel');
const Video = require('../../models/videoModel');
const User = require('../../models/userModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

const newDate = new Date().toISOString();
console.log('NEW DATE HERE:', newDate);

const formattedDate = new Date(newDate).toLocaleString('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false, // 24-hour format
});

// console.log('Formatted Date:', formattedDate);

const createVideo = catchAsync(async (req, res, next) => {
  console.log(
    `REQUESTION URL FROM CREATION OF VIDEO CONTROLLER: 🔥🔥🔥🔥🔥🔥🔥`,
    req.results,
  );

  const user = await User.findById(res.locals.user._id);
  console.log(`RES LOCAL USER ID:`, user);

  if (user.active === false)
    return new AppError(
      `The User is not authorized (yet) to upload video.\n
      Please Authenticate Your Account to Start Uploading Videos.`,
      403,
    );

  try {
    const videoFileData = req.s3Data;

    console.log('Video File Data VIDEO 🔥🔥🔥:', videoFileData.video);
    console.log('Video File Data THUMBNAIL 🔥🔥🔥:', videoFileData.thumbnail);

    const videoData = {
      title: req.body.title || `Uploaded At: ${formattedDate}`,
      description: req.body.description,
      thumbnail: videoFileData.thumbnail
        ? videoFileData.thumbnail.key
        : undefined,
      section: req.body.section,
      channel: req.user.channel._id,
      bookmark: req.body.bookmark,
      sponsors: req.body.sponsors,
      comments: req.body.comments,
      audio: req.body.audio,
      // video: req.file.filename,
      video: videoFileData.video.key,

      user: req.user.id,
      time: Date.now(),
    };

    console.log('Video data before creation:', videoData);
    // console.log(videoData.thumbnail);
    console.log(videoFileData.files);

    const createdVideo = await Video.create(videoData);

    // Update the created video record with the thumbnail

    console.log('Created video:', createdVideo);

    // Gets the Id of the Video from the videoData and Updates the channel's Video Field "videoData._id".
    // const updatedChannel =

    // THIS PUSHES THE VIDEOS INTO THE CHANNEL
    await Channel.findByIdAndUpdate(
      req.user.channel._id,
      { $push: { videos: createdVideo._id } },
      { new: true },
    );

    // Get the subscribers of the channel
    // const subscribers = updatedChannel.subscribers || [];

    // Create notifications for each subscriber
    // const mapNotification = subscribers.map((subscriberId) => ({
    //   userId: subscriberId,
    //   channelId: req.user.channel._id,
    //   videoId: createdVideo._id,
    // }));

    // Save the notifications to the database
    // const notifications = await Notification.create(mapNotification);

    if (!createdVideo) {
      return next(new AppError(`Data Not Found!`, 404));
    }

    // If No Video Data - Then Videos Array Should Be Empty
    // if (!videoData)
    //   await Channel.findByIdAndUpdate(req.user.channel._id, { video: [] });

    // If No Video Data - Then Return Error Message: Data Not Found
    if (!createdVideo) return next(new AppError(`Data Not Found!`, 404));

    // If No Section in Video Data - Then Section Array in Video Data should be empty
    if (!createdVideo.section) videoData.section = [];

    // If There is Video Data, Send a Response
    if (videoData) {
      // eslint-disable-next-line no-undef

      return res.status(201).json({
        status: 'Success',
        data: createdVideo,
      });
    }
  } catch (err) {
    console.log(`CREATE VIDEO | VIDEO CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = createVideo;
