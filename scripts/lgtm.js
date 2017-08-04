// Commands:
//  lgtm - Display LGTM image

const request = require('request');
const url = 'https://lttm-ssl.herokuapp.com/lgtm';
const logger = require.main.require('./lib/logger.js');

module.exports = controller => {
  const fetchImageUrl = (cb = () => {}) => {
    request.get(`${url}?${Math.random()}`, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return cb(true);
      }
      const result = JSON.parse(body);
      if (result.isDeleted) {
        return cb(true);
      }
      cb(false, result.imageUrl);
    });
  };

  controller.hears(
    [/(lgtm|:\+1:)/i],
    'direct_message,direct_mention,mention,ambient',
    (bot, message) => {
      let count = 0;
      let callback = (error, url) => {
        count += 1;
        if (error && count < 3) {
          return fetchImageUrl(callback);
        }
        bot.reply(message, {
          text: url,
          username: 'LGTM',
          icon_emoji: ':+1:'
        });
        bot.api.reactions.add(
          {
            timestamp: message.ts,
            channel: message.channel,
            name: '+1'
          },
          err => {
            if (err) {
              logger.log('Failed to add emoji reaction :(', err);
            }
          }
        );
      };
      fetchImageUrl(callback);
    }
  );
};
