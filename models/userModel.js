const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    firstName: {
      type: String,
      required: true,
    },
    secondName: {
      type: String,
      required: true,
    },
  },
  photo: {
    type: String,
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
    minLength: 1,
    maxLength: 30,
  },
  role: {
    type: String,
    enum: ['user', 'co-admin', 'admin'],
    default: 'user',
  },
  eAddress: {
    phoneNumber: Number,
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    signupAuthToken: String,
    signupAuthTokenExpiresIn: Date,
    password: {
      type: String,
      required: [true, 'Please Provide Password'],
      minLength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  channel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Channel',
  },
  subscriptions: [
    {
      type: mongoose.Schema.Types.ObjectId, // Reference to Subscription model
      ref: 'Pricing',
    },
  ],
  subscriptionStartDate: {
    type: Date,
    default: Date.now(), // Set a default value or leave it undefined for old users
  },
  subscribedChannels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
    },
  ],
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
      maxLength: 8,
    },
    alphabetic: {
      type: String,
      maxLength: 20,
    },
  },
  platformSettings: {
    mode: {
      type: String,
      enum: ['Simple', 'Advance', 'Professional', 'Enterprise'],
      default: 'Simple',
    },
    languages: [String],
    gui: {
      enum: {
        values: ['Variation-1', 'Variation-2', 'Variation-3'],
      },
    },
    ux: {
      scroll: {
        type: String,
        enum: {
          values: ['Smooth', 'Hard'],
        },
        default: 'Hard',
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
  accountCreatedAt: {
    type: Date,
    default: Date.now(),
  },
  resendAttempts: {
    type: Number,
    default: 0,
  },
  resendCooldownExpires: Date,
  active: {
    type: Boolean,
    default: false,
  },
});

// userSchema.pre('save', function (next) {
//   if (!this.isModified('eAddress.password') || this.isNew) return next();

//   this.eAddress.passwordChangedAt = Date.now() - 1000;
//   next();
// });

// userSchema.pre(/^find/, function (next) {
//   // This points to the current query
//   this.find({ active: { $ne: false } });
//   next();
// });

// userSchema.pre('save', async function (next) {
//   // Only run this function if password was actually modified
//   if (!this.isModified('eAddress.password')) return next();

//   // Hash the password with cost of 12
//   this.eAddress.password = await bcrypt.hash(this.eAddress.password, 12);

//   //   Delete passwordConfirm field
//   this.eAddress.passwordConfirm = undefined;
//   next();
// });

userSchema.pre('save', async function (next) {
  // Only run this function if the password is being set for the first time (signup)
  if (this.isNew || this.isModified('eAddress.password')) {
    // Hash the password with a cost of 12
    this.eAddress.password = await bcrypt.hash(this.eAddress.password, 12);

    // Remove the passwordConfirm field
    this.eAddress.passwordConfirm = undefined;
  }
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.eAddress.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.eAddress.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

userSchema.methods.createSignupAuthToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.eAddress.signupAuthToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.eAddress.passwordResetToken);

  this.eAddress.signupAuthTokenExpiresIn = Date.now() + 7 * 24 * 60 * 60 * 1000;

  return resetToken;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.eAddress.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.eAddress.passwordResetToken);

  this.eAddress.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.pre(/^find/, function (next) {
  if (!this.channel) return next();

  this.populate({
    path: 'channel',
    select:
      '_id __v products videos sponsors commentToggle comments commentFilters wires story tagsList bannerImage about user reviews',
  }).populate({
    path: 'subscribedChannels',
  });

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
