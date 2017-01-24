// Commands:
//  cat - Display random cat images

module.exports = controller => {
  controller.hears([/\b(cat|猫)\b/i], 'direct_message,direct_mention,mention', (bot, message) => {
    bot.reply(message, `http://cataas.com/cat?t=${Math.floor(new Date()/1000)}`);
  });
};
