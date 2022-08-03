import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { mailConfig } from '../../config/mail.config';

/**
 * MailService class.
 */
export default class MailService {
  /**
   * @constructor
   */
  constructor(
    /**
     * Initialization Transporter.
     *
     * @access private
     * @type Transporter
     */
    private transport: Transporter = nodemailer.createTransport(mailConfig),
  ) {}

  /**
   * @function Send verification email.
   * @access public
   * @param emailTo:string
   * @param verifyUrl:string
   * @return Promise<void>
   */
  public async sendVerificationLink(emailTo: string, verifyUrl: string): Promise<void> {
    await this.transport.sendMail({
      from: '"TEST" <test@test.com>',
      to: emailTo,
      subject: 'Verification email.',
      text: 'TEST TEXT.',
      html: `<div><h1>Please, verify your account.</h1><a href="${verifyUrl}">${verifyUrl}</a></div>`,
      headers: { priority: 'high' },
    });
  }

  /**
   * @function Send reset password email.
   * @access public
   * @param emailTo:string
   * @param restUrl:string
   * @return Promise<void>
   */
  public async sendResetPassword(emailTo: string, restUrl: string): Promise<void> {
    await this.transport.sendMail({
      from: '"TEST" <test@test.com>',
      to: emailTo,
      subject: 'ResetPassword.',
      text: 'TEST TEXT.',
      html: `<div><h1>Please, use this link.</h1><a href="${restUrl}">${restUrl}</a></div>`,
      headers: { priority: 'high' },
    });
  }
}
