import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import { loadControllers } from 'awilix-express';
import { appConfig } from '../config/app.config';
import { containerSetup } from './commons/providers/service.provider';
import { logger } from './commons/toolkit/winston-logger.toolkit';
import requestLoggerMiddleware from './middlewares/request-logger.middleware';
import errorHandlerMiddleware from './middlewares/error-handler.middleware';

/**
 * App class.
 *
 * Application configuration and bootstrap.
 */
export default class App {
  /**
   * @constructor
   */
  constructor(private readonly app: Application = express()) {}

  /**
   * @function Application bootstrap.
   * @access public
   * @return void
   */
  public bootstrap(): void {
    this.middlewareHandler();
    this.listen();
  }

  /**
   * @function Handling application middleware.
   * @access private
   * @return void
   */
  private middlewareHandler(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(cors());
    this.app.use(requestLoggerMiddleware);
    containerSetup(this.app);
    this.app.use(loadControllers('http/controllers/**{.ts,.js}', { cwd: __dirname }));
    this.app.use(errorHandlerMiddleware);
  }

  /**
   * @function Application listener.
   * @access private
   * @return void
   */
  private listen(): void {
    this.app.listen(appConfig.port, () => {
      logger.info(`App listening on port ${appConfig.port}.`);
    });
  }
}
