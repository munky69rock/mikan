const UrlHealthChecker = require.main.require('./lib/url_health_checker.js');
const logger = require.main.require('./lib/logger.js');

module.exports = controller => {
  controller.on('bot_message', (bot, message) => {
    logger.debug(`bot_message: ${message.text}`, message);
    if (!message.attachments) {
      logger.debug('bot_message: no attachments');
      return;
    }
    message.attachments.forEach(attachment => {
      logger.debug('attachment', attachment);
      const link_pattern = /[<(](https?:\/\/[^>)|]+)[>)|]/g;
      let links = [];
      if (attachment && attachment.text) {
        let m = null;
        while ((m = link_pattern.exec(attachment.text)) !== null) {
          links.push(m[1].replace(/^\s+|\s+$/g, ''));
        }
      }
      if (links.length > 0) {
        new UrlHealthChecker(links).ensure(valid_links => {
          if (valid_links.length > 0) {
            bot.reply(message, valid_links.join('\n'));
          }
        });
      }
    });
  });
};
