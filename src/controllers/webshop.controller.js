const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { webshopService } = require('../services');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const listItem = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['price', 'name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await webshopService.getListItem(filter, options, req.params.type);
  res.send(result);
});

const getItem = catchAsync(async (req, res) => {
  const result = await webshopService.getItem(req.params.type, req.params.id);
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'TỆ');
  }
  res.send(result);
});

const deleteItem = catchAsync(async (req, res) => {
  const result = await webshopService.deleteItem(req.params.type, req.params.id);
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'TỆ');
  }
  res.send(result);
});

const createItem = catchAsync(async (req, res) => {
  const result = await webshopService.createItem(req.params.type, req.body);
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'TỆ');
  }
  res.send(result);
});

const addItemToUser = catchAsync(async (req, res) => {
  const result = await webshopService.addItemToUserGame(req.user, req.body);
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'TỆ');
  }
  res.send(result);
});

const buyMoneyInGame = catchAsync(async (req, res) => {
  const result = await webshopService.buyMoneyInGame(req.user, req.body);
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'TỆ');
  }
  res.send(result);
});

const myHistory = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['typeItem', 'itemId', 'userId', 'itemId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await webshopService.myHistory(filter, options);
  res.send(result);
});

const queryHistory = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['typeItem', 'itemId', 'userId', 'itemId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await webshopService.queryHistory(filter, options);
  res.send(result);
});

const updateItem = catchAsync(async (req, res) => {
  const result = await webshopService.updateItem(req.params.type, req.params.id, req.body);
  res.send(result);
});

const getMyTransactions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['type', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await webshopService.getMyTransactions(req.user, filter, options);
  res.send(result);
});

const getCallBack = catchAsync(async (req, res) => {
  const result = await webshopService.callBackHistory(req.query);
  res.send(result);
});

const createTransaction = catchAsync(async (req, res) => {
  const result = await webshopService.createTransaction(req.user, req.body);
  res.send(result);
});

const topRank = catchAsync(async (req, res) => {
  const result = await webshopService.rankKing(req.query.type);
  res.send(result);
});

const getTransactions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['type', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await webshopService.getTransactions(filter, options);
  res.send(result);
});
const getTransaction = catchAsync(async (req, res) => {
  const result = await webshopService.getTransaction(req.params.transId);
  res.send(result);
});
const updateTransaction = catchAsync(async (req, res) => {
  const result = await webshopService.updateTransaction(req.params.transId, req.body);
  res.send(result);
});

const deleteTransaction = catchAsync(async (req, res) => {
  const result = await webshopService.deleteTransaction(req.params.transId);
  res.send(result);
});

const napCard = catchAsync(async (req, res) => {
  const result = await webshopService.napCard(req.user, req.body);
  res.send(result);
});

module.exports = {
  listItem,
  addItemToUser,
  getCallBack,
  createTransaction,
  deleteTransaction,
  updateTransaction,
  napCard,
  getTransaction,
  getTransactions,
  getMyTransactions,
  topRank,
  updateItem,
  buyMoneyInGame,
  myHistory,
  createItem,
  getItem,
  deleteItem,
  queryHistory,
};
