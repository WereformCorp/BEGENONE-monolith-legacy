/**
 * @fileoverview User schema definition with authentication and account management fields.
 * @module models/userModel
 * @layer Model
 * @collection users
 *
 * @description
 * Defines the User document schema including identity fields, nested electronic address
 * (email, password, tokens), subscription references, platform settings, and account
 * lifecycle flags. Provides pre-save password hashing via bcrypt, instance methods for
 * password verification, JWT-timestamp comparison, and cryptographic token generation
 * for signup verification and password reset flows.
 *
 * @relationships
 * - channel: ObjectId ref -> Channel (one-to-one)
 * - subscriptions: [ObjectId] ref -> Subscription
 * - currentActiveSubscription: ObjectId ref -> Subscription
 * - subscribedChannels: [ObjectId] ref -> Channel
 *
 * @dependencies
 * - Upstream: controllers/auth-controllers/*, controllers/user-controllers/*
 * - Downstream: mongoose, bcryptjs, crypto, models/pricingModel
 *
 * @security
 * Password is hashed with bcrypt (cost 12) on save. Password field excluded from
 * query results by default (select: false). Reset and signup tokens are SHA-256
 * hashed before persistence; only the plain token is returned to the caller.
 */

const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const pricing = require('./pricingModel');
// const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    firstName: {
      type: String,
      required: true,
    },
    secondName: {
      type: String,
      // required: true,
    },
  },
  photo: {
    type: String,
  },
  username: {
    type: String,
    required: true,
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
      ref: 'Subscription',
      default: async () => {
        const basicSubscription = await pricing.findOne({ name: 'signup' });
        return basicSubscription ? basicSubscription._id : null; // Return the _id of the "basic" subscription
      },
    },
  ],
  currentActiveSubscription: {
    type: mongoose.Schema.Types.ObjectId, // Direct reference to the active subscription
    ref: 'Subscription',
  },
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

/**
 * Pre-save hook: hashes eAddress.password with bcrypt (cost 12) when the document
 * is new or the password field has been modified. Clears passwordConfirm after hashing
 * to prevent persisting the plaintext confirmation value.
 */
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

/**
 * Compares a plaintext candidate password against the stored bcrypt hash.
 * @param {string} candidatePassword - Plaintext password from the login request.
 * @param {string} userPassword - Bcrypt hash stored on the user document.
 * @returns {Promise<boolean>} Resolves true if the passwords match.
 */
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * Determines whether the user changed their password after a given JWT was issued.
 * Used during token verification to invalidate JWTs issued before a password change.
 * @param {number} JWTTimestamp - The iat (issued-at) value from the decoded JWT, in seconds.
 * @returns {boolean} True if password was changed after the token was issued.
 */
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

/**
 * Generates a cryptographic signup verification token. Stores a SHA-256 hash of the
 * token on eAddress.signupAuthToken and sets a 7-day expiry. Returns the unhashed
 * token for inclusion in the verification email link.
 * @returns {string} The plaintext hex token to be sent to the user.
 */
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

/**
 * Generates a cryptographic password reset token. Stores a SHA-256 hash of the
 * token on eAddress.passwordResetToken and sets a 10-minute expiry. Returns the
 * unhashed token for inclusion in the password reset email link.
 * @returns {string} The plaintext hex token to be sent to the user.
 */
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
