// Commands:
//  contribute - Please contribute <https://github.com/munky69rock/mikan|mikan>

module.exports = controller => {
  controller.hears(
    [/contribute/i],
    'direct_message,direct_mention,mention',
    (bot, message) => {
      bot.reply(message, 'https://github.com/munky69rock/mikan.git');
    }
  );
};
