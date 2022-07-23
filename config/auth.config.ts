export type AuthConfigType = {
  secret: string;
};

export const authConfig: AuthConfigType = {
  secret: process.env.JWT_SECRET,
};
