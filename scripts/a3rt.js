const request = require('request');
const BASE_URL = 'https://api.a3rt.recruit-tech.co.jp/talk/v1/smalltalk';

module.exports = controller => {
  const token = process.env.A3RT_TOKEN
  if (!token) {
    return;
  }
  controller.on('direct_message,direct_mention,mention', (bot, message) => {
    controller.storage.users.get(message.user, (err, user) => {
      if (err || !user) {
        return;
      }
      const params = {
        apikey: token,
        query: message.text
      };
      request.post(BASE_URL, { form: params }, (err, httpResponse, body) => {
        const res = JSON.parse(body);
        try {
          bot.reply(message, res.results[0].reply);
        } catch(e) {
          bot.reply(message, `APIがなんかあやしい... ${e}`);
        }
      });
    });
  });
};
