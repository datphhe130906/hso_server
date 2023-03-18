const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const history = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    player: {
      type: String,
      required: true,
    },
    unitPrice: {
      type: Number,
    },
    quantity: {
      type: Number,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    typeItem: {
      type: Number,
      require: true,
    },
    itemId: {
      type: String,
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
