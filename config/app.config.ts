import { AppConfigType } from '../src/commons/types/app-config.type';

export const appConfig: AppConfigType = {
  environment: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.APP_PORT) || 3000,
  debug: process.env.APP_DEBUG === 'true',
  url: process.env.APP_URL,
};
