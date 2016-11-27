// Commands:
//  shinchoku add [url] - Add shinchoku images
//  shinchoku show - Show random shinchoku image
//  shinchoku dame [url] - Addd shinchoku dame image
//  shinchoku dame - Show random shinchoku dame image
//  shinchoku list - Show random shinchoku image list

const _ = require('lodash');
const strings = require('../lib/strings.js');

module.exports = controller => {
  const storage = controller.storage.of('shinchoku');

  storage.get((err, data) => {
    if (data && _.isArray(data)) {
      console.log('ok');
      storage.save({
        good: data
      });
    }
  });

  const save = (status, url, callback) => {
    storage.get((err, data) => {
      if (data) {
        if (!data[status]) {
          data[status] = [];
        }
        data[status] = data[status].concat(url)
        storage.save(data, callback);
      } else {
        storage.save({
          [status]: [url],
        }, callback);
      }
    });
  };

  const isValidUrl = (url) => {
    return url && /^https?:\/\//.test(url);
  };

  const getStatusFromKeyword = (keyword) => {
    if (/add|show|ok|good/.test(keyword)) {
      return 'good';
    } else if (/dame|no|ng|bad/.test(keyword)) {
      return 'bad';
    }
  };

  controller.hears([/shinchoku (add|ok|good|dame|no|ng) (.*)/i], 'direct_message,direct_mention,mention,ambient', (bot, message) => {
    const status = getStatusFromKeyword(message.match[1]);
    const url = message.match[2].trim().replace(/\</, '').replace(/>$/, '');

    const callback = () => {
      bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'ok_hand'
      }, (err) => {
        if (err) {
          bot.botkit.log('Failed to add emoji reaction :(', err);
        }
      }); 
    };

    if (isValidUrl(url)) {
      save(status, url, callback);
    }
  });

  controller.hears([/shinchoku (show|ok|good|dame|no|ng|bad)/i], 'direct_message,direct_mention,mention,ambient', (bot, message) => {
    const status = getStatusFromKeyword(message.match[1]);
    storage.get((err, data) => {
      if (data && data[status]) {
        bot.reply(message, _.sample(data[status], 1));
      }
    });
  });

  controller.hears([/shinchoku list/i], 'direct_message,direct_mention,mention,ambient', (bot, message) => {
    storage.get((err, data) => {
      if (data) {
        const result = strings.hdoc(`
          \`\`\`
          good:
          ${data.good.map(s => `  ${s}`).join('\n')}

          bad:
          ${data.bad.map(s => `  ${s}`).join('\n')}
          \`\`\`
        `);
        bot.reply(message, result);
      }
    });
  });
};

