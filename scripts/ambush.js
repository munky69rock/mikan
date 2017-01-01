// Commands:
//  ambush {username} {message} - Send messages to users the next time they speak

const strings = require('../lib/strings.js');
const Ambush = require('../lib/ambush.js');

module.exports = controller => {

  const storage = controller.storage.of(__filename);
  const ambush = new Ambush(storage);
  ambush.load();

  controller.hears([/ambush (\S+) (.*)/i], 'direct_message,direct_mention,mention', (bot, message) => {
    const user = message.match[1].trim().replace(/^<@/, '').replace(/>$/, '');
    const text = message.match[2];
    if (user && text) {
      ambush.push(user, message.user, text);

      bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'ok_hand'
      }, (err) => {
        if (err) {
          bot.botkit.log('Failed to add emoji reaction :(', err);
        }
      }); 
    }
  });

  controller.hooks.add('ambient', (bot, message) => {
    if (ambush.isEmpty()) {
      return;
    }

    ambush.pop(message.user).forEach(item => {
      bot.reply(message, strings.hdoc(`
        <@${message.user}>: while you were out, <@${item.user}> said: ${item.message}
      `));
    });
  });
};
