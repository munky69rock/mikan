const exec = require('child_process').exec; 
const fs = require('fs');
const path = require('path');
const logger = require.main.require('./lib/logger.js');
const Interval = require.main.require('./lib/interval.js');

const mkdirIfNotExists = (...dirs) => {
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });
};

const getToday = () => {
  const date = new Date();
  return [
    date.getFullYear(),
    ('0' + (date.getMonth() + 1)).slice(-2),
    ('0' + date.getDate()).slice(-2)
  ].join('');
};

const baseDir = path.join(__dirname, '..');
const tmpDir = path.join(baseDir, 'tmp');
const backupDir = path.join(tmpDir, 'backup');
const dataDir = path.join(baseDir, 'data');
const callback = (err, stdout, stderr) => {
  if (stdout) {
    logger.info(stdout);
  }
  if (stderr) {
    logger.warn(stderr);
  }
  if (err) {
    logger.error(err);
  }
};

module.exports = () => {
  mkdirIfNotExists(tmpDir, backupDir);
  exec(`zip -r ${backupDir}/${getToday()}.zip ${dataDir}`, callback);

  // keep backup 1 week
  fs.readdirSync(backupDir).forEach(f => {
    const fpath = path.join(backupDir, f);
    const mtime = fs.statSync(fpath).mtime;
    if (Interval.eval(mtime, 60*60*24*7)) {
      logger.info(`remove file: ${fpath}`);
      fs.unlink(fpath);
    }
  });
};
