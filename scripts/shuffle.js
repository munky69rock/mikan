// Commands:
//  shuffle - Choose users

const _ = require('lodash');

module.exports = controller => {
  controller.hears([/shuffle (.*)/i], 'direct_message,direct_mention,mention', (bot, message) => {
    const regex = new RegExp(`[\\s${String.fromCharCode(12288)}]+`); // 全角スペース
    const list = RegExp.$1.split(regex);
    bot.reply(message, _.shuffle(list).map((n, i) => `${i + 1}. ${n}`).join('\n'));
  });
};

