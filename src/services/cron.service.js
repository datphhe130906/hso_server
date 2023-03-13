/* eslint-disable eqeqeq */
/* eslint-disable no-await-in-loop */
const cron = require('node-cron');
const logger = require('../config/logger');
const axios = require('axios');
const { checkTrans } = require('./webshop.service');
const { Transaction, User } = require('../models');
const Account = require('../models/mysqlModel/user.model');
const configs = require('../config/config');
// const TelegramBot = require('node-telegram-bot-api');

async function runCronJob() {
  cron.schedule('00 */1 * * * *', async () => {
    logger.info('Cron job started');
    const checkTransPending = await Transaction.find({
      status: 'pending',
      type: 'card',
      createdAt: {
        $gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      },
    });
    // eslint-disable-next-line no-restricted-syntax
    for (const iterator of checkTransPending) {
      // eslint-disable-next-line no-await-in-loop
      const rs = await checkTrans(iterator);
      if (rs.data.status == 1 || rs.data.status == 2) {
        const user = await User.findById(iterator.userId);
        if (user.status !== 'active' && parseInt(rs.data.value, 10) >= 20000) {
          await Account.update(
            {
              status: 0,
            },
            {
              where: {
                user: user.user,
              },
            }
          );
          await user.updateOne(
            {
              status: 'active',
            },
            { new: true }
          );
        }
        await user.updateOne(
          {
            coin: user.coin + (rs.data.value * configs.gachthe1s.rate) / 100,
            totalPay: user.totalPay + rs.data.value,
          },
          { new: true }
        );
        const bot = new TelegramBot('6029081062:AAHuZtysElaHgYtRZuQpIjnSSq8KDJD6EE4', { polling: true });
        await bot.sendMessage(
          '-913523699',
          `[Nhận tiền gachthe1s]:
          Tài khoản ${user.user} vừa nạp ${rs.data.value} thành công.`
        );
      }
    }
  });

  cron.schedule('00 */1 * * * *', async () => {
    logger.info('Cron Momo started');
    const checkHistoryMomo = await axios.get(`${configs.momoApis.getHistory}${configs.momoApis.token}`);
    if (checkHistoryMomo.data.momoMsg.tranList.length > 0) {
      for (const iterator of checkHistoryMomo.data.momoMsg.tranList) {
        const checkValidTran = await Transaction.findOne({
          requestId: iterator.tranId,
        });
        console.log(checkValidTran);
        if (checkValidTran) continue;
        if (parseInt(iterator.status) === 999) {
          console.log(iterator);
          const user = await User.findOne({
            user: iterator.comment,
          });
          const tran = new Transaction();
          tran.requestId = iterator.tranId;
          tran.code = iterator.comment;
          tran.content = iterator.desc;
          tran.type = 'momo';
          tran.status = 'success';
          tran.amount = iterator.amount;
          tran.userId = user ? user.id : 'null';
          await tran.save();
          if (user.status !== 'active' && iterator.amount >= 20000) {
            await Account.update(
              {
                status: 0,
              },
              {
                where: {
                  user: user.user,
                },
              }
            );
            await user.updateOne(
              {
                status: 'active',
              },
              { new: true }
            );
          }
          await user.updateOne(
            {
              coin: user.coin + iterator.amount,
              totalPay: user.totalPay + iterator.amount,
            },
            { new: true }
          );
          const bot = new TelegramBot('6029081062:AAHuZtysElaHgYtRZuQpIjnSSq8KDJD6EE4', { polling: true });
          await bot.sendMessage('-913523699', `Tài khoản ${user.user} vừa nạp ${rs.data.value} thành công.`);
        }
      }
    }
  });
}

module.exports = {
  runCronJob,
};
