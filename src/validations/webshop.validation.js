const Joi = require('joi');
const { User } = require('../models');

const addItemToUserGame = {
  user: User,
  body: Joi.object().keys({
    itemId: Joi.number().required(),
    item: Joi.number().required(),
    plus: Joi.number().required().default(0),
    isLock: Joi.boolean().default(false),
    player: Joi.string().required(),
    quantity: Joi.number().required().default(1),
  }),
};

const updateTransaction = {
  params: Joi.object().keys({
    transId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    status: Joi.string().required(),
    amount: Joi.number(),
  }),
};

const createTransaction = {
  user: User,
  body: Joi.object().keys({
    code: Joi.number(),
    serial: Joi.string(),
    telco: Joi.string(),
    amount: Joi.number().required(),
    type: Joi.string().required(),
  }),
};

const napCard = {
  user: User,
  body: Joi.object().keys({
    code: Joi.number().required(),
    serial: Joi.string().required(),
    telco: Joi.string().required(),
    amount: Joi.number().required(),
  }),
};

module.exports = {
  addItemToUserGame,
  napCard,
  createTransaction,
  updateTransaction,
};
