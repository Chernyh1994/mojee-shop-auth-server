import { AuthConfigType } from '../src/commons/types/config.type';

const dateNow: Date = new Date();
const expireDate: Date = new Date(dateNow.setMonth(dateNow.getMonth() + 1));

/**
 * Auth configuration.
 */
export const authConfig: AuthConfigType = {
  /**
   * Secret key for JWT access token;
   */
  secretAccess: process.env.JWT_ACCESS_SECRET,

  /**
   * JWT access token expired;
   */
  expireInAccess: '60m',

  /**
   * The secret key to work with the refresh token cryptography. Must be 32 characters long;
   */
  secretRefresh: process.env.REFRESH_TOKEN_SECRET,

  /**
   * An initialization vector (is the input to a cryptographic primitive
   * used to provide the initial state) to work with the refresh token cryptography.
   * Must be 16 characters long;
   */
  ivRefresh: process.env.REFRESH_TOKEN_IV,

  /**
   * Refresh token expired;
   */
  expireInRefresh: expireDate,
};
