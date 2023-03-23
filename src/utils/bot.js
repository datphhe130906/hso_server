const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot('6029081062:AAHuZtysElaHgYtRZuQpIjnSSq8KDJD6EE4', { polling: true });

module.exports = {
    bot,
};