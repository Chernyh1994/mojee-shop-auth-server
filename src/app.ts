import express, { Application } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import { loadControllers } from 'awilix-express';
import { loadContainer } from './providers/service.provider';
import { appConfig } from '../config/app.config';
import WinstonLogger from '../toolkit/winston-logger.toolkit';
import requestLoggerMiddleware from './middlewares/request-logger.middleware';
import errorHandlerMiddleware from './middlewares/error-handler.middleware';

export default class App {
  private logger: WinstonLogger;

  private readonly app: Application;

  constructor() {
    this.app = express();
    this.logger = new WinstonLogger();
  }

  public async start(): Promise<void> {
    this.middlewareHandler();
    this.listen();
    this.uncaughtException();
    this.unhandledRejection();
  }

  private middlewareHandler(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(requestLoggerMiddleware);
    loadContainer(this.app);
    this.app.use(
      loadControllers('controllers/**{.ts,.js}', { cwd: __dirname }),
    );
    this.app.use(errorHandlerMiddleware);
  }

  private listen(): void {
    this.app.listen(appConfig.port, () => {
      this.logger.create.info(`App listening on port ${appConfig.port}.`);
    });
  }

  private uncaughtException(): void {
    process.on('uncaughtException', (error: Error) => {
      this.logger.create.error(error.message);
      process.exit(1);
    });
  }

  public unhandledRejection(): void {
    process.on('unhandledRejection', (error: Error) => {
      this.logger.create.error(error.message);
      process.exit(1);
    });
  }
}
