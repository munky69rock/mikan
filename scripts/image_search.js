// Commands:
//  image {query} - Search image

const GoogleCustomSearch = require('../lib/google_custom_search.js');
const _ = require('lodash');
const logger = require('../lib/logger.js');

module.exports = controller => {
  if (!GoogleCustomSearch.isAvailable()) {
    logger.warn('`GOOGLE_CUSTOM_SEARCH_API_KEY` or `GOOGLE_CUSTOM_SEARCH_ENGINE_ID` not defined');
    return;
  }

  controller.hears([/image (.+)/], 'direct_message,direct_mention,mention', (bot, message) => {
    GoogleCustomSearch.searchImage(message.match[1], result => {
      const items = result.items;
      const item = _.shuffle(items)[0];
      bot.reply(message, item.link);
    });
  });
};
