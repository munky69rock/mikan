// Commands:
//   <name>++
//   <name>--

const ScoreKeeper = require('../lib/score_keeper.js');
const strings = require('../lib/strings.js');
const logger = require('../lib/logger.js');

module.exports = controller => {
  const scoreKeeper = new ScoreKeeper(controller.storage.of(__filename));
  controller.hears([/([\w\S]+)(?:[\W\s]*)?(\+\+|\-\-)$/], 'direct_message,direct_mention,mention,ambient', (bot, message) => {
    const name = message.match[1];
    const symbol = message.match[2];
    let emoji = '';
    if (symbol === '++') {
      scoreKeeper.add(name, message);
      emoji = '+1';
    } else if (symbol === '--') {
      scoreKeeper.subtract(name, message);
      emoji = '-1';
    }
    const score = scoreKeeper.get(name);
    bot.reply(message, strings.hdoc(`
      > ${name}++: ${score['++']}
      > ${name}--: ${score['--']}
    `));
    bot.api.reactions.add({
      timestamp: message.ts,
      channel: message.channel,
      name: emoji
    }, (err) => {
      if (err) {
        logger.log('Failed to add emoji reaction :(', err);
      }
    }); 
  });
};
