const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const item1 = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    content: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);
// add plugin that converts mongoose to json
item1.plugin(toJSON);
item1.plugin(paginate);

/**
 * @typedef Item1
 */
const Item1 = mongoose.model('Item1', item1);

module.exports = Item1;
