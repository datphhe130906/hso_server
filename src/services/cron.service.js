/* eslint-disable eqeqeq */
/* eslint-disable no-await-in-loop */
const cron = require('node-cron');
const logger = require('../config/logger');
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
}

module.exports = {
  runCronJob,
};
