const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const item4schema = mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
    },
    icon: {
      type: Number,
      required: true,
    },
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
item4schema.plugin(toJSON);
item4schema.plugin(paginate);

/**
 * @typedef Item4
 */
const Item4 = mongoose.model('Item4', item4schema);

module.exports = Item4;
