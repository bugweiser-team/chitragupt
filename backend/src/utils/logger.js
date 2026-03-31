const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'legal-aid-platform' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new DailyRotateFile({
      dirname:        logDir,
      filename:       'audit-%DATE%.log',
      datePattern:    'YYYY-MM-DD',
      zippedArchive:  true,
      maxSize:        '20m',
      maxFiles:       '30d',
      level:          'info',
    }),
    new DailyRotateFile({
      dirname:        logDir,
      filename:       'error-%DATE%.log',
      datePattern:    'YYYY-MM-DD',
      zippedArchive:  true,
      maxSize:        '20m',
      maxFiles:       '30d',
      level:          'error',
    }),
  ],
});

module.exports = logger;
