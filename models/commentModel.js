const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      // required: [true, 'Comment must belong to a user.'],
    },

    time: {
      type: Date,
      defaut: Date.now(),
    },
    comment: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 5000,
    },

    likes: Number,
    channel: {
      type: mongoose.Schema.ObjectId,
      ref: 'Channel',
      select: 'name _id displayImage',
    },
    dislike: Number,
    reply: {
      isReply: {
        type: Boolean,
        default: false,
      },
      comment: {
        type: mongoose.Schema.ObjectId,
        ref: 'Comment',
      },
    },
    video: {
      type: mongoose.Schema.ObjectId,
      ref: 'Video',
      required: [true, 'Comment must belong to a video.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
