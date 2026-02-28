/**
 * @fileoverview Comment schema with self-referential reply support.
 * @module models/commentModel
 * @layer Model
 * @collection comments
 *
 * @description
 * Defines the Comment document schema supporting both top-level comments and threaded
 * replies via a self-referential reply.comment ObjectId. Each comment is associated with
 * a User, a Channel, and optionally a Video. Pre-find hooks populate the authoring User
 * and Channel. A pre-save hook clears the reply reference when isReply is false.
 *
 * @relationships
 * - user: ObjectId ref -> User
 * - channel: ObjectId ref -> Channel
 * - video: ObjectId ref -> Video
 * - reply.comment: ObjectId ref -> Comment (self-referential)
 *
 * @dependencies
 * - Upstream: controllers/comment-controllers/*, routes/commentRoutes
 * - Downstream: mongoose, models/User, models/Channel, models/Video
 */

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
      default: Date.now(),
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
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

commentSchema.pre('find', function (next) {
  this.populate({
    path: 'user',
    select: '_id name.firstName name.secondName', // Include fields you want to populate
  }).populate({
    path: 'channel',
    select:
      '-__v -products -videos -sponsors -commentToggle -comments -commentFilters -wires -story -tagsList -bannerImage -about -user -reviews',
  });
  next();
});

commentSchema.pre('save', function (next) {
  if (this.reply.isReply === false) this.reply.comment = [];
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
