import winston from 'winston';
import _ from 'lodash';
import { ENV } from './get-env.js';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'white',
};

const formatOptions = _.compact([
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format((info) => ({
    ...info,
    level: `[${info.level.toUpperCase()}]`,
  }))(),
  winston.format.splat(),
  // TODO: Remove color in production environment
  ENV === 'development' && winston.format.colorize({ level: true }),
  winston.format.printf((info) => `${info.timestamp} ${info.level} ${info.message}`),
]);

winston.addColors(colors);
const format = winston.format.combine(...formatOptions);
const transports = [new winston.transports.Console()];

const Logger = winston.createLogger({
  level: ENV === 'development' ? 'debug' : 'info',
  levels,
  format,
  transports,
});

export default Logger;
