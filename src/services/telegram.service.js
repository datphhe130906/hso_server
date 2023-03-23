const axios = require('axios');
const configs = require('../config/config');

const { bot } = require('../utils/bot');

bot.onText(/\/checkBalance/, async (msg, match) => {
  const checkBalance = await axios.get(`https://api.web2m.com/apigetsodu/${configs.momoApis.token}`);
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Số dư hiện tại của bạn là: ${checkBalance.data.SoDu.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VND`
  );
});
bot.onText(/^\/ruttien\s\d+$/, async (msg, match) => {
  const amount = match.input.split(' ')[1];
  const trans = await axios.post('https://api.web2m.com/api/v3/service/momo/transfer', {
    token: configs.momoApis.token,
    phone: '0879003737',
    amount,
    comment: 'HsoRaze Api.Web2m rút tiền',
    password: '061019',
  });
  const chatId = msg.chat.id;
  if (trans.data.status == 200 && trans.data.code == 999) {
    bot.sendMessage(chatId, `Đã chuyển ${amount} VND thành công tới cho những người nghèo khổ!!`);
    bot.sendMessage(chatId, `Số dư còn lại là ${trans.data.balance} VND`);
  } else {
    bot.sendMessage(chatId, 'Có lỗi xảy ra, vui lòng thử lại sau!');
  }
});
