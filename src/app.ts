import express, { Application } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import { loadControllers } from 'awilix-express';
import { containerSetup } from './providers/service.provider';
import { appConfig } from '../config/app.config';
import { logger } from './commons/toolkit/winston-logger.toolkit';
import requestLoggerMiddleware from './middlewares/request-logger.middleware';
import errorHandlerMiddleware from './middlewares/error-handler.middleware';

export default class App {
  constructor(private readonly app: Application = express()) {}

  public bootstrap(): void {
    this.middlewareHandler();
    this.listen();
  }

  private middlewareHandler(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(requestLoggerMiddleware);
    containerSetup(this.app);
    this.app.use(
      loadControllers('http/controllers/**{.ts,.js}', { cwd: __dirname }),
    );
    this.app.use(errorHandlerMiddleware);
  }

  private listen(): void {
    this.app.listen(appConfig.port, () => {
      logger.info(`App listening on port ${appConfig.port}.`);
    });
  }
}
