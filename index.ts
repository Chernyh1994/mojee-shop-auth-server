import 'reflect-metadata';
import 'dotenv/config';
import { Container } from 'typedi';
import App from './src/app';

const app: App = Container.get(App);
app.start();
