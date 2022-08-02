import { MailConfigType } from '../src/commons/types/config.type';

/**
 * Mail configuration.
 */
export const mailConfig: MailConfigType = {
  /**
   * The hostname or IP address to connect to (defaults to ‘localhost’);
   */
  host: process.env.SMTP_HOST || 'localhost',

  /**
   * Port to connect to (defaults to 587 if is secure is false or 465 if true);
   */
  port: parseInt(process.env.SMTP_PORT),

  /**
   * Secure if true the connection will use TLS when connecting to server.
   * If false (the default) then TLS is used if server supports the STARTTLS extension.
   * In most cases set this value to true if you are connecting to port 465.
   * For port 587 or 25 keep it false
   */
  secure: false,

  /**
   * Authentication object;
   */
  auth: {
    /**
     * The username;
     */
    user: process.env.SMTP_USER,

    /**
     * The password for the user if normal login is used;
     */
    pass: process.env.SMTP_PASSWORD,
  },

  /**
   * Optional bunyan compatible logger instance. If set to true then logs to console.
   * If value is not set or is false then nothing is logged;
   */
  logger: true,

  /**
   * If set to true, then logs SMTP traffic, otherwise logs only transaction events;
   */
  debug: true,
};
