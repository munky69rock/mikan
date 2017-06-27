// Commands:
//  shuffle - Choose users

const _ = require('lodash');

module.exports = controller => {
  controller.hears([/shuffle (.*)/i], 'direct_message,direct_mention,mention', (bot, message) => {
    const list = RegExp.$1.split(/[\s　]/);
    bot.reply(message, _.shuffle(list).map((n, i) => `${i + 1}. ${n}`).join('\n'));
  });
};

