// Commands:
//  help - Show help

const help = require('../lib/help.js');
module.exports = controller => {
  controller.hears(['help'], 'direct_message,direct_mention,mention', (bot, message) => {
    bot.reply(message, help.commands.map(line => { return `> ${line}`; }).join('\n'));
  });
};
