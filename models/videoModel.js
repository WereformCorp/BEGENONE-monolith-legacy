const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A Video Must Have A Title.'],
      minLength: 1,
      maxLength: 200,
    },
    description: {
      type: String,
      required: false,
      maxLength: 10000,
    },
    thumbnail: String,
    views: Number,
    likes: Number,
    dislikes: Number,
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
    sponsors: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Sponsor',
      },
    ],

    audio: Boolean,
    video: String,
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

videoSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'video',
  localField: '_id',
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
