const { CronJob } = require('cron');
const logger = require('../config/logger');
const { checkTrans } = require('./webshop.service');
const { Transaction } = require('../models');

const job = new CronJob(
  '00 00 */1 * * *',
  async function () {
    logger.info('Cron job started');
    const checkTransPending = await Transaction.find({
      status: 'pending',
      type: 'card',
    });
    // eslint-disable-next-line no-restricted-syntax
    for (const iterator of checkTransPending) {
      // eslint-disable-next-line no-await-in-loop
      await checkTrans(iterator);
    }
  },
  true /* Start the job right now */,
  'Asia/Ho_Chi_Minh' /* Time zone of this job. */
);
job.start();
