import * as winston from 'winston';
import { Logger } from 'winston';
import { Format } from 'logform';
import { CliConfigSetColors, CliConfigSetLevels } from 'winston/lib/winston/config';
import { appConfig } from '../../../config/app.config';

const configSetLevels: CliConfigSetLevels = {
  error: 0,
  warn: 1,
  help: 2,
  data: 3,
  info: 4,
  debug: 5,
  prompt: 6,
  verbose: 7,
  input: 8,
  silly: 9,
};

const configSetColors: CliConfigSetColors = {
  error: 'red',
  warn: 'yellow',
  help: 'gray',
  data: 'blue',
  info: 'green',
  debug: 'blue',
  prompt: 'green',
  verbose: 'gray',
  input: 'blue',
  silly: 'yellow',
};

winston.addColors(configSetColors);

const winstonFormat: Format = winston.format.combine(
  winston.format.colorize({
    all: true,
  }),
  winston.format.label({
    label: 'LOGGER',
  }),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.printf(({ label, timestamp, level, message }) => {
    return `${label} | ${timestamp} | ${level}: ${message}`;
  }),
);

export const logger: Logger = winston.createLogger({
  level: appConfig.debug ? 'debug' : 'warn',
  levels: configSetLevels,
  format: winstonFormat,
  transports: [new winston.transports.Console()],
});
