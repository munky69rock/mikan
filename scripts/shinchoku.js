// Commands:
//  shinchoku add [url] - Add shinchoku images
//  shinchoku show - Show random shinchoku image
//  shinchoku dame [url] - Add shinchoku dame image
//  shinchoku dame - Show random shinchoku dame image
//  shinchoku list - Show random shinchoku image list

const _ = require('lodash');
const color = require('../lib/color.js');

module.exports = controller => {
  const storage = controller.storage.of('shinchoku');

  const save = (status, url, callback) => {
    storage.get((err, data) => {
      if (data) {
        if (!data[status]) {
          data[status] = [];
        }
        data[status] = data[status].concat(url);
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
    if (/add|show|ok|good|どう/.test(keyword)) {
      return 'good';
    } else if (/dame|no|ng|bad|ダメ/.test(keyword)) {
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

  controller.hears([/shinchoku (show|ok|good|dame|no|ng|bad)/i, /(進捗ダメ(?:です)?|進捗どう(?:ですか)?)/], 'direct_message,direct_mention,mention,ambient', (bot, message) => {
    const status = getStatusFromKeyword(message.match[1]);
    storage.get((err, data) => {
      if (data && data[status]) {
        const url = _.sample(data[status], 1);
        let title = '';
        let clr = '';
        if (status === 'good') {
          title = '進捗どうですか';
          clr = color.info;
        } else {
          title = '進捗ダメです';
          clr = color.danger;
        }
        bot.reply(message, {
          username: 'esa',
          icon_emoji: ':esa:',
          attachments: [
            {
              title: `<${url}|${title}>`,
              image_url: url,
              color: clr,
            }
          ]
        });
      }
    });
  });

  controller.hears([/shinchoku list/i], 'direct_message,direct_mention,mention,ambient', (bot, message) => {
    storage.get((err, data) => {
      if (data) {
        bot.reply(message, {
          username: 'esa',
          icon_emoji: ':esa:',
          attachments: [
            {
              title: 'GOOD',
              text: data.good.join('\n'),
              color: color.success
            },
            {
              title: 'BAD',
              text: data.bad.join('\n'),
              color: color.danger
            }
          ]
        });
      }
    });
  });
};

