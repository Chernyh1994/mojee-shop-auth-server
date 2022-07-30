import { AuthConfigType } from '../src/commons/types/auth-config.type';

const dateNow: Date = new Date();
const expireDate: Date = new Date(dateNow.setMonth(dateNow.getMonth() + 1));

export const authConfig: AuthConfigType = {
  secretAccess: process.env.JWT_ACCESS_SECRET,
  secretRefresh: process.env.REFRESH_TOKEN_SECRET,
  ivRefresh: process.env.REFRESH_TOKEN_IV,
  expireInAccess: '1m',
  expireInRefresh: expireDate,
};
