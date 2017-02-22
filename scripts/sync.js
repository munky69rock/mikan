// Commands:
//  sync - Sync slack data

const SlackSync = require.main.require('./lib/slack_sync.js');
const Interval  = require.main.require('./lib/interval.js');
const logger    = require.main.require('./lib/logger.js');

module.exports = controller => {
  const interval = new Interval();

  controller.hears([/sync/i], 'direct_message,direct_mention,mention', (bot, message) => {
    if (!interval.eval()) {
      logger.warn('skip sync');
      return;
    }
    SlackSync(bot).all();
    bot.api.reactions.add({
      timestamp: message.ts,
      channel: message.channel,
      name: 'ok_hand'
    }, (err) => {
      if (err) {
        logger.log('Failed to add emoji reaction :(', err);
      }
    }); 
  });
};

