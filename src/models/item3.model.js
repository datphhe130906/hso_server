const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const item3schema = mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      required: true,
    },
    part: {
      type: Number,
      required: true,
    },
    clazz: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
    },
    iconId: {
      type: Number,
    },
    level: {
      type: Number,
    },
    data: {
      type: String,
    },
    color: {
      type: Number,
      required: true,
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
item3schema.plugin(toJSON);
item3schema.plugin(paginate);

/**
 * @typedef Item3
 */
const Item3 = mongoose.model('Item3', item3schema);

module.exports = Item3;
