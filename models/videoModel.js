const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
  title: {
    type: String,
    minLength: 1,
    maxLength: 120,
    default: Date.now(),
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
      thumbnail: {
        type: String,
        default: 'img/default.jpeg',
      },
      timeStamp: String, // WILL Calculate the time in other functions and send them as a string
      title: {
        type: String,
        required: true,
        unique: true,
        minLength: 1,
        maxLength: 30,
      },
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
  comments: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Comment',
    },
  ],
  audio: Boolean,
  video: String,
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
