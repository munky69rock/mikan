const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const isDevelopment = process.env.ENV === 'development';

const level = isDevelopment ? 'debug' : 'info';
const transports = [
  new winston.transports.DailyRotateFile({
    filename: path.join(__dirname, `../logs/${level}`),
    datePattern: '.yyyyMMdd',
    level: level
  })
];
if (isDevelopment) {
  transports.push(new winston.transports.Console());
}

module.exports = new winston.Logger({ transports });
