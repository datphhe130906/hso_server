/* eslint-disable eqeqeq */
/* eslint-disable no-await-in-loop */
const cron = require('node-cron');
const logger = require('../config/logger');
const { checkTrans } = require('./webshop.service');
const { Transaction, User } = require('../models');
const Player = require('../models/mysqlModel/player.model');
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
      const user = await User.findOne({ user: iterator.userId });
      user.coin += (rs.value * configs.gachthe1s.rate) / 100000;
      await user.save();
    }
  });

  cron.schedule('00 */5 * * * *', async () => {
    logger.info('Cron job started');
    const checkTransPending = await Transaction.find({
      status: 'pending',
      type: 'active',
      createdAt: {
        $gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      },
    });
    // eslint-disable-next-line no-restricted-syntax
    for (const iterator of checkTransPending) {
      // eslint-disable-next-line no-await-in-loop
      const rs = await checkTrans(iterator);
      // eslint-disable-next-line eqeqeq
      if (parseInt(rs.data.value, 10) >= 20000) {
        if (rs.data.status == 1 || rs.data.status == 2) {
          await Player.update(
            { status: 0 },
            {
              where: {
                name: iterator.playerName,
              },
            }
          );
          const user = await User.findOne({ user: iterator.userId });
          user.coin += (rs.value * configs.gachthe1s.rate) / 100000;
          await user.save();
        }
      }
    }
  });
}

module.exports = {
  runCronJob,
};
