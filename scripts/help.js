// Commands:
//  help - Show help

const help = require('../lib/help.js');
module.exports = controller => {
  controller.hears(['help'], 'direct_message,direct_mention,mention', (bot, message) => {
    bot.reply(message, {
      attachments: [
        {
          text: help.commands.join('\n')
        }
      ]
    });
  });
};
