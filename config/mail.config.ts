import { MailConfigType } from '../src/commons/types/mail-config.type';

export const mailConfig: MailConfigType = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD,
};
