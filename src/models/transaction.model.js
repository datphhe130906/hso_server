const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const transaction = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    requestId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
    },
    statusResponse: {
      type: String,
    },
    data: {
      type: Object,
    },
    code: {
      type: String,
    },
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
// add plugin that converts mongoose to json
transaction.plugin(toJSON);
transaction.plugin(paginate);

/**
 * @typedef Transaction
 */
const Transaction = mongoose.model('Transaction', transaction);

module.exports = Transaction;
