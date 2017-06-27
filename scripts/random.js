// Commands:
//  random - Choose random N users in this channel

const _ = require('lodash');
const logger = require.main.require('./lib/logger.js');

module.exports = controller => {
  controller.hears([/(?:random|抽選(?:してよ)?)(?:\s+(\d))?/i], 'direct_message,direct_mention,mention', (bot, message) => {
    const n = parseInt(RegExp.$1 || 1);
    const type = /^G/.test(message.channel) ? 'group' : 'channel';
    const api = bot.api[`${type}s`].info;

    const channel = message.channel;

    api({ channel: channel }, (err, res) => {
      if (err) {
        return logger.error(err);
      }
      const members = res[type].members.filter(m => m != bot.identity.id);
      let target_members = _.sampleSize(members, n);
      bot.reply(message, target_members.map(m => `<@${m}>`).join(' '));
    });
  });
};
