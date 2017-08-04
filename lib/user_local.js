const request = require('request');
const BASE_URL = 'https://chatbot-api.userlocal.jp/api/chat';

module.exports = (token, controller) => {
  if (!token) {
    return;
  }
  controller.on('direct_message,direct_mention,mention', (bot, message) => {
    controller.storage.users.get(message.user, (err, user) => {
      if (err || !user) {
        return;
      }
      const params = {
        message: encodeURIComponent(message.text),
        key: token,
        bot_name: 'mikan',
        platform: 'slack',
        user_name: user.name
      };
      const url = `${BASE_URL}?${Object.entries(params)
        .map(param => param.join('='))
        .join('&')}`;
      request.get(url, (err, httpResponse, body) => {
        const res = JSON.parse(body);
        bot.reply(message, res.result);
      });
    });
  });
};
