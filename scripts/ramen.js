// Commands:
//  ramen - Display random ramen image

const GoogleCustomSearch = require.main.require('./lib/google_custom_search.js');
const _ = require('lodash');
const logger = require.main.require('./lib/logger.js');

module.exports = controller => {
  if (!GoogleCustomSearch.isAvailable()) {
    logger.warn('`GOOGLE_CUSTOM_SEARCH_API_KEY` or `GOOGLE_CUSTOM_SEARCH_ENGINE_ID` not defined');
    return;
  }

  controller.hears([/ramen|ラーメン|らーめん/], 'direct_message,direct_mention,mention,ambient', (bot, message) => {
    GoogleCustomSearch.searchImage('ラーメン', result => {
      const items = result.items;
      const item = _.shuffle(items)[0];

      bot.reply(message, {
        text: item.link,
        username: 'ramen',
        icon_emoji: ':ramen:'
      });
    });
  });
};
