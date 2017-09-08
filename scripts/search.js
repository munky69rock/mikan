// Commands:
//  search {query} - Search keywords
//  image {query} - Search image
//  images {query} - Search images

const _ = require('lodash');
const GoogleCustomSearch = require.main.require(
  './lib/google_custom_search.js'
);
const logger = require.main.require('./lib/logger.js');

module.exports = controller => {
  if (!GoogleCustomSearch.isAvailable()) {
    logger.warn(
      '`GOOGLE_CUSTOM_SEARCH_API_KEY` or `GOOGLE_CUSTOM_SEARCH_ENGINE_ID` not defined'
    );
    return;
  }

  controller.hears(
    [/search (.+)/],
    'direct_message,direct_mention,mention',
    (bot, message) => {
      GoogleCustomSearch.searchKeyword(message.match[1], result => {
        const items = result.items;
        let body = '';
        items.forEach((item, i) => {
          body += `${i}. <${item.link}|${item.title}>\n`;
        });
        bot.reply(message, {
          attachments: [
            {
              title: `「${message.match[1]}」の検索結果`,
              text: body
            }
          ]
        });
      });
    }
  );

  controller.hears(
    [/image (.+)/],
    'direct_message,direct_mention,mention',
    (bot, message) => {
      GoogleCustomSearch.searchImage(message.match[1], result => {
        const items = result.items;
        const item = _.shuffle(items)[0];
        bot.reply(message, item.link);
      });
    }
  );

  controller.hears(
    [/images (.+)/],
    'direct_message,direct_mention,mention',
    (bot, message) => {
      GoogleCustomSearch.searchImage(message.match[1], result => {
        const items = result.items;
        let body = '';
        items.forEach(item => {
          body += `${item.link}\n`;
        });
        bot.reply(message, {
          attachments: [
            {
              title: `「${message.match[1]}」の検索結果`,
              text: body
            }
          ]
        });
      });
    }
  );
};
