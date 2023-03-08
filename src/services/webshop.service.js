const httpStatus = require('http-status');
const axios = require('axios');
const { MD5 } = require('crypto-js');
const config = require('../config/config');
const { Item3, User, Item4, Item7, Transaction } = require('../models');
const ApiError = require('../utils/ApiError');
const Player = require('../models/mysqlModel/player.model');
const logger = require('../config/logger');

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {number} listNumber
 * @returns {Promise<Item3>}
 */
const getListItem = async (filter, options, listNumber) => {
  switch (listNumber) {
    case 3:
      return Item3.paginate(filter, options);
    // case 4:
    //   return Item4.find();
    // case 7:
    //   return Item7.find();
    default:
      return Item3.find();
  }
};

const checkTrans = async (request) => {
  const apiGachthe = await axios.post(config.gachthe1s.url, {
    request_id: request.requestId,
    amount: request.data.amount,
    telco: request.data.telco,
    serial: request.data.serial,
    code: request.data.code,
    partner_id: config.gachthe1s.partner_id,
    command: 'check',
    sign: MD5(`${config.gachthe1s.partner_key}${request.data.code}${request.data.serial}`).toString(),
  });
  switch (apiGachthe.data.status) {
    case 1:
    case 2: {
      await Transaction.findOneAndUpdate(
        { requestId: request.requestId },
        { status: 'success', statusResponse: apiGachthe.data.message },
        { new: true }
      );
      break;
    }
    case 3:
    case 4:
    case 100: {
      await Transaction.findOneAndUpdate(
        { requestId: request.requestId },
        { status: 'failed', statusResponse: apiGachthe.data.message },
        { new: true }
      );
      break;
    }
    default:
      break;
  }
  return apiGachthe.data;
};

const addItemToUserGame = async (user, body) => {
  let itemInfo = {};
  const _user = await User.findOne({ user: user.user });
  const player = await Player.findOne({
    where: {
      name: body.player,
    },
  });
  if (!player) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Player not found');
  }
  let priceToPay;
  switch (body.item) {
    case 3: {
      itemInfo = await Item3.findOne({
        itemId: body.itemId,
      });
      const oldItem = JSON.parse(player.item3);
      let newItem = `[${itemInfo.itemId},${itemInfo.clazz},${itemInfo.type},${itemInfo.level},${itemInfo.iconId},${
        itemInfo.color
      },${itemInfo.part},${body.isLock ? 1 : 0},${body.plus},${itemInfo.data},0]`;
      newItem = JSON.parse(newItem);
      oldItem.push(newItem);
      player.item3 = JSON.stringify(oldItem);
      priceToPay = itemInfo.price;
      break;
    }

    case 4: {
      itemInfo = await Item4.findOne({ itemId: body.itemId });
      const oldItem = JSON.parse(player.item4);
      const obj = oldItem.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
      if (obj[body.itemId]) {
        obj[body.itemId] += body.quantity;
      } else {
        obj[body.itemId] = body.quantity;
      }
      const newItem = Object.entries(obj).map(([key, value]) => [Number(key), value]);
      player.item4 = JSON.stringify(newItem);
      priceToPay = itemInfo.price * body.quantity;
      break;
    }
    case 7: {
      itemInfo = await Item7.findOne({ itemId: body.itemId });
      const oldItem = JSON.parse(player.item7);
      const newObject = oldItem.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
      if (newObject[body.itemId]) {
        newObject[body.itemId] += body.quantity;
      } else {
        newObject[body.itemId] = body.quantity;
      }
      const newItem = Object.entries(newObject).map(([key, value]) => [Number(key), value]);
      player.item7 = JSON.stringify(newItem);
      priceToPay = itemInfo.price * body.quantity;
      break;
    }
    default:
      throw new ApiError(httpStatus.NO_CONTENT, 'Unprocessable Entity');
  }
  if (priceToPay > _user.coin) {
    throw new ApiError(httpStatus.PAYMENT_REQUIRED, 'Bạn không đủ tiền thanh toán');
  }
  _user.coin -= priceToPay;
  await _user.save();
  await player.save();
  return itemInfo;
};

const napCard = async (user, body) => {
  const requestId = Math.random() * (999999999 - 10000000) + 10000000;
  const _trans = new Transaction();
  _trans.userId = user.id;
  _trans.type = 'card';
  _trans.amount = body.amount;
  _trans.requestId = requestId;
  _trans.data = {
    amount: body.amount,
    telco: body.telco,
    serial: body.serial,
    code: body.code,
  };
  const sign = MD5(`${config.gachthe1s.partner_key}${body.code}${body.serial}`).toString();
  const apiGachthe = await axios.post(config.gachthe1s.url, {
    request_id: requestId,
    amount: body.amount,
    telco: body.telco,
    serial: body.serial,
    code: body.code,
    partner_id: config.gachthe1s.partner_id,
    command: 'charging',
    sign,
  });
  logger.info(apiGachthe.data);
  switch (apiGachthe.data.status) {
    case 1:
    case 2:
      {
        _trans.status = 'success';
        _trans.statusResponse = apiGachthe.data.message;
        const _user = await User.findOne({ user: user.user });
        _user.coin += (apiGachthe.data.value * config.gachthe1s.rate) / 100000;
        await _user.save();
      }
      break;
    case 3:
    case 4:
    case 100:
      _trans.status = 'failed';
      _trans.statusResponse = apiGachthe.data.message;
      break;
    case 99:
      _trans.status = 'pending';
      break;
    default:
      throw new ApiError(httpStatus.BAD_REQUEST, 'Lỗi hệ thống');
  }
  await _trans.save();
  return _trans;
};

const callBackHistory = async (request) => {
  const _transCallback = await Transaction.findOne({ requestId: request.request_id });
  // eslint-disable-next-line eqeqeq
  if (_transCallback.status === 'pending') {
    const apiGachthe = await axios.post(config.gachthe1s.url, {
      request_id: request.request_id,
      amount: request.declared_value,
      telco: request.telco,
      serial: request.serial,
      code: request.code,
      partner_id: config.gachthe1s.partner_id,
      command: 'check',
      sign: MD5(`${config.gachthe1s.partner_key}${request.code}${request.serial}`).toString(),
    });
    // eslint-disable-next-line eqeqeq
    if (apiGachthe.status != 99) {
      switch (apiGachthe.data.status) {
        case 1 || '1':
          _transCallback.status = 'success';
          _transCallback.statusResponse = apiGachthe.data.message;
          break;
        case 2 || '2':
          _transCallback.status = 'success';
          _transCallback.statusResponse = apiGachthe.data.message;
          break;
        case 3 || '3':
          _transCallback.status = 'failed';
          _transCallback.statusResponse = apiGachthe.data.message;
          break;
        case 4 || '4':
          _transCallback.status = 'failed';
          _transCallback.statusResponse = apiGachthe.data.message;
          break;
        case 100 || '100':
          _transCallback.status = 'failed';
          _transCallback.statusResponse = apiGachthe.data.message;
          break;
        default:
          break;
      }
    }
  }

  if (!_transCallback) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  _transCallback.data = request;
  await _transCallback.save();
  logger.info('Transaction callback', _transCallback);
  logger.info('Request callback', request);
  return _transCallback;
};

const createTransaction = async (user, body) => {
  const _trans = new Transaction();
  _trans.userId = user.id;
  _trans.type = body.type;
  _trans.amount = body.amount;
  _trans.requestId = Math.random() * (999999999 - 10000000) + 10000000;
  _trans.status = 'pending';
  _trans.code = user.user;
  await _trans.save();
  return _trans;
};

const rankKing = async (type) => {
  if (type === 'topPay') {
    const topPay = await Transaction.aggregate([
      {
        $match: {
          status: 'success',
        },
      },
      {
        $group: {
          _id: '$userId',
          total: { $sum: '$data.amount' },
        },
      },
      {
        $sort: {
          total: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);
    const topPayUser = await User.find()
      .where('_id')
      .in(topPay.map((item) => item._id))
      .exec();
    return topPayUser;
  }
  if (type === 'topLevel') {
    const topLevel = await Player.findAll({
      order: [['level', 'DESC']],
      limit: 10,
    });
    return topLevel;
  }
};

const getTransaction = async (transId) => {
  const _trans = await Transaction.findById(transId);
  return _trans;
};

const getTransactions = async (filter, options) => {
  const transactions = await Transaction.paginate(filter, options);
  return transactions;
};

const getMyTransactions = async (user, filter, options) => {
  const transactions = await Transaction.paginate({ userId: user.id, ...filter }, options);
  return transactions;
};

const updateTransaction = async (transId, body) => {
  const _trans = await Transaction.findByIdAndUpdate(transId, { status: body.status }, { new: true });
  return _trans;
};

const deleteTransaction = async (transId) => {
  await Transaction.findByIdAndDelete(transId);
  return { susscess: true };
};
module.exports = {
  getListItem,
  addItemToUserGame,
  deleteTransaction,
  updateTransaction,
  createTransaction,
  callBackHistory,
  checkTrans,
  getTransaction,
  getTransactions,
  getMyTransactions,
  napCard,
  rankKing,
};
