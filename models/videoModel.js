const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxLength: 200,
    },
    description: {
      type: String,
      required: false,
      maxLength: 10000,
    },
    thumbnail: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
      },
    ],
    dislikes: {
      type: Number,
      default: 0,
    },
    dislikedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
      },
    ],
    time: {
      type: Date,
      default: Date.now(),
    },
    section: [
      {
        thumbnail: String,
        timeStamp: String, // WILL Calculate the time in other functions and send them as a string
        sectTitle: String,
      },
    ],
    channel: {
      type: mongoose.Schema.ObjectId,
      ref: 'Channel',
    },
    bookmark: {
      type: Boolean,
      default: false,
    },
    // sponsors: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Sponsor',
    //   },
    // ],

    comments: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Comment',
      },
    ],

    audio: Boolean,
    video: String,
    tags: [
      {
        type: String,
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    active: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

videoSchema.pre('save', function (next) {
  if (!this.video) {
    throw new Error('Video path is required');
  }
  next();
});

// videoSchema.pre(/^find/, function (next) {
//   next();
// });

// videoSchema.virtual('comments', {
//   ref: 'Comment',
//   foreignField: 'video',
//   localField: '_id',
// });

videoSchema.pre(/^find/, function (next) {
  if (this.active === false) this.select = false;
  this.populate({
    path: 'channel',
    select:
      '-__v -products -videos -sponsors -commentToggle -comments -commentFilters -wires -story -tagsList -about -reviews',
  })
    .populate({
      path: 'comments',
      select: '_id comment time',
    })
    .populate({
      path: 'sponsors',
      select:
        '-__v -video -gallery -companyLogo -productDescription -companyWebsite -productWebsite -productPromoCode -messageAdOwner -messageContentCreator',
    });
  // .populate({
  //   path: 'user',
  //   select: '_id displayImage',
  // });

  next();
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
