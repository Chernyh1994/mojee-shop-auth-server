import express, { Application } from 'express';
import * as bodyParser from 'body-parser';
import { DataSource } from 'typeorm';
import cors from 'cors';
import { Inject, Service } from 'typedi';
import ApiRoute from '../routes/api.route';
import { appConfig } from '../config/app.config';
import WinstonLogger from '../toolkit/winston-logger.toolkit';
import requestLoggerMiddleware from './middlewares/request-logger.middleware';

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
  }

  private middlewareHandler(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(requestLoggerMiddleware);
    this.app.use(this.apiRoute.init());
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
}
