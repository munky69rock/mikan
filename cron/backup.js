const CronJob = require('cron').CronJob;
const _ = require('lodash');
const logger = require('../lib/logger.js');
const backup = require('../lib/backup.js');

module.exports = bot => {
  new CronJob({
    cronTime: '10 0 * * *',
    onTick() {
      backup();
    },
    start: true,
    timeZone: 'Asia/Tokyo'
  });  
};
