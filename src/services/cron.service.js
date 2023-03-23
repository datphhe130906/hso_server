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
const { bot } = require('../utils/bot');

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
            totalPay: user.totalPay + (rs.data.value * configs.gachthe1s.rate) / 100,
          },
          { new: true }
        );

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
        if (checkValidTran) continue;
        if (parseInt(iterator.status) === 999) {
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

          await bot.sendMessage('-913523699', `Tài khoản ${user.user} vừa nạp ${rs.data.value} thành công.`);
        }
      }
    }
  });
  cron.schedule('00 */1 * * * *', async () => {
    logger.info('Cron Chuyển tiền về ví momo xịn');
    const checkBalance = await axios.get(`https://api.web2m.com/apigetsodu/${configs.momoApis.token}`);
    if (checkBalance.data.SoDu <= 100_000) {
      return;
    }
    const trans = await axios.post('https://api.web2m.com/api/v3/service/momo/transfer', {
      token: configs.momoApis.token,
      phone: '0879003737',
      amount: 100000,
      comment: 'HsoRaze Api.Web2m auto chuyển tiền',
      password: '061019',
    });
    if (trans.data.status == 200 && trans.data.code == 999) {
      await bot.sendMessage(
        '-913523699',
        `Đã Tự Động Rút 100k Từ Tài Khoản 0963225935 Về Tài Khoản 0879003737. Chúc Bạn Nhanh Giàu 🥰`
      );
    } else {
      await bot.sendMessage('-913523699', `Có tiền rồi nhưng chuyển thất bại, kiểm tra lại nhé.`);
    }
  });
}

module.exports = {
  runCronJob,
};
