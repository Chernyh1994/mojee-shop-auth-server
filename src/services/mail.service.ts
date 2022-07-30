import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { mailConfig } from '../../config/mail.config';

export default class MailService {
  private transport: Transporter;

  constructor() {
    this.transport = nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      logger: true,
      debug: true,
      secure: false,
      auth: {
        user: mailConfig.user,
        pass: mailConfig.password,
      },
    });
  }

  public async sendVerificationLink(
    emailTo: string,
    verifyUrl: string,
  ): Promise<void> {
    await this.transport.sendMail({
      from: '"TEST" <test@test.com>',
      to: emailTo,
      subject: 'Verification email.',
      text: 'TEST TEXT.',
      html: `<div><h1>Please, verify your account.</h1><a href="${verifyUrl}">${verifyUrl}</a></div>`,
      headers: { priority: 'high' },
    });
  }
}
