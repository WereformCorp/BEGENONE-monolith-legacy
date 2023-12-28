const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
  name: {
    required: true,
    firstName: {
      type: String,
      required: true,
    },
    secondName: {
      type: String,
      required: true,
    },
  },
  displayImage: {
    type: String,
    default: 'img/default.jpeg',
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    maxLength: 50,
  },
  displayName: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 30,
  },
  eAddress: {
    phoneNumber: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please enter a valid email.'],
    },
    password: {
      type: String,
      required: [true, 'Please Provide Password'],
      minLength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please Confirm Your Password'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  channel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Channel',
  },
  token: {
    type: String,
    enum: {
      values: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Crown'],
      default: 'Bronze',
    },
  },
  lockAccount: {
    numeric: {
      type: Number,
      max: 7,
    },
    alphabetic: {
      type: String,
      max: 20,
    },
  },
  platformSettings: {
    mode: {
      type: String,
      required: true,
      enum: {
        values: ['Simple', 'Advance', 'Professional', 'Enterprise'],
      },
      message: 'Mode is either Simple, Advance, Professional or Enterprise',
      default: 'Simple',
    },
    languages: [String],
    gui: {
      required: true,
      enum: {
        values: ['Variation-1', 'Variation-2', 'Variation-3'],
        default: 'Variation-1',
      },
    },
    ux: {
      scroll: {
        type: String,
        enum: {
          values: ['Smooth', 'Hard'],
          default: 'Hard',
        },
      },
      popUp: {
        type: Boolean,
        default: false,
      },
      cookies: {
        type: Boolean,
        default: false,
      },
    },
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
