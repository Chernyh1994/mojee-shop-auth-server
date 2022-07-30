export type AuthConfigType = {
  readonly secretAccess: string;
  readonly secretRefresh: string;
  readonly ivRefresh: string;
  readonly expireInAccess: string;
  readonly expireInRefresh: Date;
};
