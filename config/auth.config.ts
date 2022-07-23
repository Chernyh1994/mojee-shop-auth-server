export type AuthConfigType = {
  readonly secret: string;
};

export const authConfig: AuthConfigType = {
  secret: process.env.JWT_SECRET,
};
