const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { postService } = require('../services');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const createPost = catchAsync(async (req, res) => {
  const post = await postService.createPost(req.body);
  res.status(201).send(post);
});

const updatePost = catchAsync(async (req, res) => {
  const post = await postService.updatePost(req.params.postId, req.body);
  res.send(post);
});

const listPost = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await postService.listPost(filter, options);
  res.send(result);
});

const getPost = catchAsync(async (req, res) => {
  const post = await postService.getPostById(req.params.postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  res.send(post);
});

const delPost = catchAsync(async (req, res) => {
  await postService.delPost(req.params.postId);
  res.status(204).send();
});

module.exports = {
  createPost,
  updatePost,
  listPost,
  delPost,
  getPost,
};
