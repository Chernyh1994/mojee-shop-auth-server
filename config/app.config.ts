import { AppConfigType } from '../src/commons/types/config.type';

/**
 * General application configuration.
 */
export const appConfig: AppConfigType = {
  /**
   * Application environment;
   */
  environment: process.env.NODE_ENV || 'development',

  /**
   * Application working port. 3000 port by default;
   */
  port: parseInt(process.env.APP_PORT) || 3000,

  /**
   * Application debugger;
   */
  debug: process.env.APP_DEBUG === 'true',

  /**
   * Application working url;
   */
  url: process.env.APP_URL,

  /**
   * Secret key for dealing with application-wide cryptography. Must be 32 characters long;
   */
  secret: process.env.APP_SECRET,

  /**
   * An initialization vector (is the input to a cryptographic primitive
   * used to provide the initial state) for dealing with application-wide
   * cryptography. Must be 16 characters long;
   */
  iv: process.env.APP_IV,
};
