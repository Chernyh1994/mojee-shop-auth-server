export type AppConfigType = {
  environment: string;
  port: number;
  debug: boolean;
};

export const appConfig: AppConfigType = {
  environment: process.env.APP_ENV ?? 'development',
  port: parseInt(process.env.APP_PORT) ?? 3000,
  debug: process.env.DEBUG === 'true',
};
