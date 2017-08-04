// Commands:
//  cat - Display random cat images

module.exports = controller => {
  controller.hears(
    [/ping/i],
    'direct_message,direct_mention,mention',
    (bot, message) => {
      bot.reply(message, 'pong');
    }
  );
};
