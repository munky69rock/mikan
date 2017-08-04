// Commands:
//  stamp {text} - [WIP] Generate stamp image

const StampGenerator = require.main.require('./lib/stamp_generator.js');

module.exports = controller => {
  const stampGenerator = new StampGenerator();
  controller.hears(
    [/(?:stamp|hanko|はんこ) (.+)/i],
    'direct_message,direct_mention,mention,ambient',
    (bot, message) => {
      const text = message.match[1].trim();
      stampGenerator.render(text, (err, hash) => {
        if (err) {
          return;
        }
        bot.reply(message, {
          attachments: [
            {
              title: text,
              image_url: `${controller.config.stamp_uri}/${hash}.png`
            }
          ]
        });
      });
    }
  );
};
