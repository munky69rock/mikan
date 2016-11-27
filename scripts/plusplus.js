// Commands:
//   <name>++
//   <name>--

const ScoreKeeper = require('../lib/score_keeper.js');
const strings = require('../lib/strings.js');

module.exports = controller => {
  const scoreKeeper = new ScoreKeeper(controller.storage.of(__filename));
  controller.hears([/([\w\S]+)(?:[\W\s]*)?(\+\+|\-\-)$/], 'direct_message,direct_mention,mention', (bot, message) => {
    const name = message.match[1];
    const symbol = message.match[2];
    if (symbol === '++') {
      scoreKeeper.add(name, message);
    } else if (symbol === '--') {
      scoreKeeper.subtract(name, message);
    }
    const score = scoreKeeper.get(name);
    bot.reply(message, strings.hdoc(`
      > ${name}++: ${score['++']}
      > ${name}--: ${score['--']}
    `));
  });
};
