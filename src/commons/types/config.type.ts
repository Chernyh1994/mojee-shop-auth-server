export type AppConfigType = {
  readonly environment: string;
  readonly port: number;
  readonly debug: boolean;
  readonly url: string;
  readonly secret: string;
  readonly iv: string;
};

export type AuthConfigType = {
  readonly secretAccess: string;
  readonly secretRefresh: string;
  readonly ivRefresh: string;
  readonly expireInAccess: string;
  readonly expireInRefresh: Date;
};

export type MailConfigType = {
  readonly host: string;
  readonly port: number;
  readonly secure: boolean;
  readonly auth: {
    readonly user: string;
    readonly pass: string;
  };
  readonly logger: boolean;
  readonly debug: boolean;
};
