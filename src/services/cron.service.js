/* eslint-disable eqeqeq */
/* eslint-disable no-await-in-loop */
const cron = require('node-cron');
const logger = require('../config/logger');
const axios = require('axios');
const { checkTrans } = require('./webshop.service');
const { Transaction, User } = require('../models');
const Account = require('../models/mysqlModel/user.model');
const configs = require('../config/config');

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
        if (user.status !== 'active' && parseInt(rs.data.value, 10) >= 10000) {
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
          await user.updateOne({
            status: 'active',
          });
        }
        user.update({
          coin: user.coin + (rs.data.value * configs.gachthe1s.rate) / 100000,
        });
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
        if (!checkValidTran && parseInt(iterator.status) === 999) {
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
          if (user) {
            tran.userId = user.id;
          } else {
            tran.userId = 'null';
          }
          await tran.save();
          console.log(tran);
          if (user.status !== 'active' && iterator.amount >= 100) {
            user.update({
              status: 'active',
            });
          }
          user.update({
            coin: user.coin + iterator.amount / 1000,
          });
        }
      }
    }
  });
}

module.exports = {
  runCronJob,
};
