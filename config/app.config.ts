import { DataSourceOptions } from 'typeorm';
import { databaseConfig } from './database.config';

export type AppConfigType = {
  readonly environment: string;
  readonly port: number;
  readonly debug: boolean;
  readonly database: DataSourceOptions;
};

export const appConfig: AppConfigType = {
  environment: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.APP_PORT) || 3000,
  debug: process.env.APP_DEBUG === 'true',
  database: databaseConfig,
};
