const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  user: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      select: 'Name _id photo',
      // This will show up in case there is no channel registered to that user's account
    },
  ],
  time: {
    type: Date,
    defaut: Date.now(),
  },
  comment: [
    {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 5000,
    },
  ],
  likes: Number,
  channel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Channel',
    select: 'Name _id displayImage',
  },
  dislike: Number,
  reply: {
    type: Boolean,
    default: false,
    comment: {
      type: mongoose.Schema.ObjectId,
      ref: 'Comment',
    },
  },
  video: {
    type: mongoose.Schema.ObjectId,
    ref: 'Video',
    select: '_id',
  },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
