// Commands:
//  ship it - Display a motivation squirrel

module.exports = controller => {
  controller.hears([/ship\s*it/i], ['direct_message','direct_mention','mention','ambient'], (bot, message) => {
    bot.api.reactions.add({
      timestamp: message.ts,
      channel: message.channel,
      name: 'shipit'
    }, (err) => {
      if (err) {
        bot.botkit.log('Failed to add emoji reaction :(', err);
      }
    }); 
  });
};
