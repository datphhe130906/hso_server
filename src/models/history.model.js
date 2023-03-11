const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const history = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    unitPrice: {
      type: Number,
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
    typeItem: {
      type: Number,
      require: true,
    },
    itemId: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);
// add plugin that converts mongoose to json
history.plugin(toJSON);
history.plugin(paginate);

/**
 * @typedef History
 */
const History = mongoose.model('History', history);

module.exports = History;
