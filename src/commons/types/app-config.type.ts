export type AppConfigType = {
  readonly environment: string;
  readonly port: number;
  readonly debug: boolean;
  readonly url: string;
  readonly secret: string;
  readonly iv: string;
};
