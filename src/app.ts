import express, { Application, Router } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import { Inject, Service } from 'typedi';
import { DataSource } from 'typeorm';
import ApiRoute from '../routes/api.route';
import { appConfig } from '../config/app.config';
import WinstonLogger from '../toolkit/winston-logger.toolkit';
import requestLoggerMiddleware from './middlewares/request-logger.middleware';
import errorHandlerMiddleware from './middlewares/error-handler.middleware';

@Service()
export default class App {
  @Inject()
  private apiRoute: ApiRoute;

  @Inject()
  private logger: WinstonLogger;

  private app: Application;

  constructor() {
    this.app = express();
  }

  public async start(): Promise<void> {
    this.middlewareHandler();
    this.listen();
    await this.connectDatabase();
    this.uncaughtException();
    this.unhandledRejection();
  }

  private middlewareHandler(): void {
    const routers: Router = this.apiRoute.init();

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(requestLoggerMiddleware);
    this.app.use(routers);
    this.app.use(errorHandlerMiddleware);
  }

  private listen(): void {
    this.app.listen(appConfig.port, () => {
      this.logger.create.info(`App listening on port ${appConfig.port}.`);
    });
  }

  private async connectDatabase(): Promise<void> {
    const connectionSource: DataSource = new DataSource(appConfig.database);
    await connectionSource.initialize();
    this.logger.create.info('Connected to database.');
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
