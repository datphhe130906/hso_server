const { Post } = require('../models');

const createPost = async (post) => {
  const newPost = new Post();
  newPost.title = post.title;
  newPost.content = post.content.replace(/&lt;/g, '<');
  await newPost.save();
  return newPost;
};

const updatePost = async (id, post) => {
  const newpost = await Post.findByIdAndUpdate(
    id,
    {
      title: post.title,
      content: post.content.replace(/&lt;/g, '<'),
    },
    { new: true }
  );
  return newpost;
};

const listPost = async (filter, options) => {
  return await Post.paginate(filter, options);
};

const getPostById = async (id) => {
  return await Post.findById(id);
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
