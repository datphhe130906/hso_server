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
};
