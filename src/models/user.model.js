const mongoose = require('mongoose');
// const validator = require('validator');
// const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
      validate(value) {
        if (value.length < 4 || value.length > 20) {
          throw new Error('Password must be between 4 and 20 characters');
        }
      },
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    player1: {
      type: String,
      default: '',
    },
    player2: {
      type: String,
      default: '',
    },
    player3: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: 'pending',
      enum: { values: ['active', 'pending', 'banned'], message: '{VALUE} is not supported' },
    },
    totalPay: {
      type: Number,
      default: 0,
    },
    coin: {
      type: Number,
      default: 0,
    },
    phone: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);
// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
