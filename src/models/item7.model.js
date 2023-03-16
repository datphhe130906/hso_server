const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const item7schema = mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
    },
    imgId: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    content: {
      type: String,
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
item7schema.plugin(toJSON);
item7schema.plugin(paginate);

/**
 * @typedef Item7
 */
const Item7 = mongoose.model('Item7', item7schema);

module.exports = Item7;
