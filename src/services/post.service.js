const { Post } = require('../models');

const createPost = async (post) => {
  const newPost = new Post();
  newPost.content = post.content.replace(/&lt;/g, '<');
  await newPost.save();
  return newPost;
};

const updatePost = async (id, post) => {
  const newpost = await Post.findByIdAndUpdate(
    id,
    {
      content: post.content,
    },
    { new: true }
  );
  return newpost;
};

const listPost = async (filter, options) => {
  const posts = await Post.paginate(filter, options);
  return posts;
};

const getPostById = async (id) => {
  const post = await Post.findById(id);
  return post;
};

const delPost = async (id) => {
  const post = await Post.findByIdAndDelete(id);
  return post;
};

module.exports = {
  createPost,
  updatePost,
  listPost,
  delPost,
  getPostById,
};
