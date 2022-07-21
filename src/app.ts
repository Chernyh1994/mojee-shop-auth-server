import express, { Application } from 'express';
import * as bodyParser from 'body-parser';
import { DataSource } from 'typeorm';
import cors from 'cors';
import { appConfig } from '../config/app.config';

class App {
  private app: Application;

  constructor() {
    this.app = express();
  }

  public async start(): Promise<void> {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors());

    await this.listen();
    await App.connectDatabase();
  }

  private async listen(): Promise<void> {
    this.app.listen(appConfig.port, () => {
      console.log(`App listening on port ${appConfig.port}`);
    });
  }

  private static async connectDatabase(): Promise<void> {
    const connectionSource: DataSource = new DataSource(appConfig.database);
    await connectionSource.initialize();
  }
}

export default App;
