import express, { Application } from 'express';
import * as bodyParser from 'body-parser';
import { DataSource } from 'typeorm';
import cors from 'cors';
import { Service } from 'typedi';
import ApiRoute from '../routes/api.route';
import { appConfig } from '../config/app.config';

@Service()
export default class App {
  private app: Application;

  constructor(private readonly apiRoute: ApiRoute) {
    this.app = express();
  }

  public async start(): Promise<void> {
    this.middlewareHandler();
    this.listen();
    await App.connectDatabase();
  }

  private middlewareHandler(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(this.apiRoute.init());
  }

  private listen(): void {
    this.app.listen(appConfig.port, () => {
      console.log(`App listening on port ${appConfig.port}.`);
    });
  }

  private static async connectDatabase(): Promise<void> {
    const connectionSource: DataSource = new DataSource(appConfig.database);
    await connectionSource.initialize();
    console.log('Connected to database.');
  }
}
