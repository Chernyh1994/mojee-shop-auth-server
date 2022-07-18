import express, { Application } from 'express';
import * as bodyParser from 'body-parser';
import { appConfig } from '../config/app.config';

class App {
  private app: Application;

  constructor() {
    this.app = express();
  }

  public start() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.listen();

    this.app.get('/', (req, res) => {
      res.send('Hello World!');
    });
  }

  private listen() {
    this.app.listen(appConfig.port, () => {
      console.log(`App listening on port ${appConfig.port}`);
    });
  }
}

export default App;
