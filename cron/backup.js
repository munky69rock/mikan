const CronJob = require('cron').CronJob;
const backup = require.main.require('./lib/backup.js');

module.exports = () => {
  new CronJob({
    cronTime: '10 0 * * *',
    onTick() {
      backup();
    },
    start: true,
    timeZone: 'Asia/Tokyo'
  });
};
