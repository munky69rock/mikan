const request = require('request');
const cheerio = require('cheerio');
const URL = require('url');
const _ = require('lodash');

const url = URL.parse('http://www.irasutoya.com/search');

module.exports = controller => {
  controller.hears(
    [/(?:いらすとや|irasutoya) (.+)/],
    'direct_message,direct_mention,mention,ambient',
    (bot, message) => {
      url.query = {
        q: message.match[1]
      };

      request.get(URL.format(url), (error, response, body) => {
        if (error || response.statusCode !== 200) {
          return;
        }

        const $ = cheerio.load(body);

        try {
          const scripts = $('a > script');
          const script = _.sample(scripts);
          const m = script.children[0].data.match(
            /(https?:\/\/[^"]+)","([^"]+)"/
          );
          const image_src = m[1].replace('/s72-c/', '/s180-c/');
          const image_alt = m[2];

          bot.reply(message, {
            attachments: [
              {
                title: `<${image_src}|${image_alt}>`,
                image_url: image_src
              }
            ]
          });
        } catch (e) {
          //console.dir(e);
        }
      });
    }
  );
};
