const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const post = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
// add plugin that converts mongoose to json
post.plugin(toJSON);
post.plugin(paginate);

/**
 * @typedef Post
 */
const Post = mongoose.model('Post', post);

module.exports = Post;
