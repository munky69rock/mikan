const CronJob = require('cron').CronJob;
const _ = require('lodash');
const holiday = require('holiday-jp');
const logger = require('../lib/logger.js');
const color = require('../lib/color.js');

const images = [
  'https://qiita-image-store.s3.amazonaws.com/0/23997/2981ab1a-3f67-8e28-72d9-e519f030cff1.jpeg',
  'http://66.media.tumblr.com/888ad0c8852a01cbed34413e3cb322a6/tumblr_n9o93yL71p1sckns5o1_1280.jpg',
  'http://66.media.tumblr.com/f09e2ba914c6a398b7860ee42f3f616a/tumblr_mrkro8chrX1sckns5o1_500.png',
  'https://pbs.twimg.com/media/BJZU7q4CIAEL7Vp.jpg:small',
  'https://sdl-stickershop.line.naver.jp/stickershop/v1/product/1015196/iphone/main@2x.png',
  'http://f.maruyu.catchball.co/img/jo9.png',
  'http://65.media.tumblr.com/c79d6b59dc4ee10595564c8aafc2225e/tumblr_mrkrngeogp1sckns5o1_500.png',
  'http://tn-skr3.smilevideo.jp/smile?i=24187254.L',
  'http://livedoor.blogimg.jp/tank_make/imgs/3/b/3b089b3a.jpg',
  'http://66.media.tumblr.com/067d04f3df4605af4a6c574237cb06e2/tumblr_mqlmq4YufD1sckns5o1_500.jpg',
];

module.exports = bot => {
  const storage = bot.botkit.storage.of('shinchoku');

  bot.botkit.storage.channels.all((err, channels) => {
    if (err) {
      logger.warn(err);
    }

    const channel = _.find(channels, { name: 'esa' });

    new CronJob({
      cronTime: '0 20 * * 1-5',
      onTick() {
        if (holiday.isHoliday(new Date())) {
          return;
        }
        storage.get((err, data) => {
          if (data) {
            const url = _.sample(images.concat(data['good']), 1);
            bot.say({
              channel: channel.id,
              username: 'esa',
              icon_emoji: ':esa:',
              attachments: [
                {
                  title: `<${url}|進捗どうですか>`,
                  image_url: url,
                  color: color.success,
                }
              ]
            });
          }
        });
      },
      start: true,
      timeZone: 'Asia/Tokyo'
    });  
  });
};
