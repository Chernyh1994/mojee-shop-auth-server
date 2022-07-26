import * as winston from 'winston';
import {
  CliConfigSetColors,
  CliConfigSetLevels,
} from 'winston/lib/winston/config';
import { Format } from 'logform';
import { appConfig } from '../config/app.config';

export default class WinstonLogger {
  public get create() {
    WinstonLogger.addColors();

    return winston.createLogger({
      level: appConfig.debug ? 'debug' : 'warn',
      levels: WinstonLogger.configSetLevels(),
      format: WinstonLogger.format(),
      transports: [new winston.transports.Console()],
    });
  }

  private static configSetLevels(): CliConfigSetLevels {
    return {
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
  }

  private static configSetColors(): CliConfigSetColors {
    return {
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
  }

  private static addColors(): void {
    winston.addColors(WinstonLogger.configSetColors());
  }

  private static format(): Format {
    return winston.format.combine(
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
  }
}
