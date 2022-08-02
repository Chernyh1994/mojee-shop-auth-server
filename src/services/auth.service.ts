import * as bcrypt from 'bcrypt';
import UserService from './user.service';
import TokenService from './token.service';
import MailService from './mail.service';
import CryptoService from './crypto.service';
import { UserEntity } from '../entity/user.entity';
import { appConfig } from '../../config/app.config';
import ForbiddenException from '../commons/exceptions/http/forbidden.exception';
import UnauthorizedException from '../commons/exceptions/http/unauthorized.exception';
import { ResponseMessageType, ResponseTokensType } from '../commons/types/response.type';
import { ForgotPasswordRequest } from '../http/requests/auth/forgot-password.request';
import { PasswordResetRequest } from '../http/requests/auth/password-reset.request';
import { RegistrationRequest } from '../http/requests/auth/registration.request';
import { LoginRequest } from '../http/requests/auth/login.request';

/**
 * AuthService class.
 */
export default class AuthService {
  /**
   * @constructor
   */
  constructor(
    /**
     * UserService Dependency Injection.
     *
     * @access private
     * @type UserService
     */
    private userService: UserService,

    /**
     * TokenService Dependency Injection.
     *
     * @access private
     * @type TokenService
     */
    private tokenService: TokenService,

    /**
     * MailService Dependency Injection.
     *
     * @access private
     * @type MailService
     */
    private mailService: MailService,

    /**
     * CryptoService Dependency Injection.
     *
     * @access private
     * @type CryptoService
     */
    private cryptoService: CryptoService,
  ) {}

  /**
   * @function Create and authentication a new user.
   * @access public
   * @param registrationRequest:RegistrationRequest
   * @return Promise<ResponseTokensType>
   */
  public async registration(registrationRequest: RegistrationRequest): Promise<ResponseTokensType> {
    const user: UserEntity = await this.userService.createUser(registrationRequest);
    const temporaryLink: string = this.encryptTemporaryLink(user.id);
    const verifyUrl = `${appConfig.url}/auth/verify/${temporaryLink}`;

    await this.mailService.sendVerificationLink(user.email, verifyUrl);

    return await this.tokenService.generateTokens(user.id);
  }

  /**
   * @function User authentication.
   * @access public
   * @param loginRequest:LoginRequest
   * @return Promise<ResponseTokensType>
   */
  public async login(loginRequest: LoginRequest): Promise<ResponseTokensType> {
    const user: UserEntity = await this.validateUser(loginRequest.email, loginRequest.password);

    if (!user) {
      throw new UnauthorizedException('Incorrect username or password.');
    }

    return await this.tokenService.generateTokens(user.id);
  }

  /**
   * @function Logout user.
   * @access public
   * @param refreshToken:string
   * @return Promise<ResponseMessageType>
   */
  public async logout(refreshToken: string): Promise<ResponseMessageType> {
    const isDeleted: boolean = await this.tokenService.deleteRefreshToken(refreshToken);

    if (!isDeleted) {
      throw new ForbiddenException('Error logout.');
    }

    return { data: 'Logout success.' };
  }

  /**
   * @function User verification via email.
   * @access public
   * @param link:string
   * @return Promise<ResponseMessageType>
   */
  public async verifyUser(link: string): Promise<ResponseMessageType> {
    const userId: number = await this.decryptTemporaryLink(link);
    const user: UserEntity = await this.userService.verifyUser(userId);

    if (!user) {
      throw new ForbiddenException('User not verified.');
    }

    return { data: 'User has been verified.' };
  }

  /**
   * @function Refresh access token and refresh token.
   * @access public
   * @param refreshToken:string
   * @return Promise<ResponseTokensType>
   */
  public async refresh(refreshToken: string): Promise<ResponseTokensType> {
    if (!refreshToken) {
      throw new UnauthorizedException('Unauthorized.');
    }

    return await this.tokenService.refreshTokens(refreshToken);
  }

  /**
   * @function Sending password recovery email.
   * @access public
   * @param forgotPasswordRequest:ForgotPasswordRequest
   * @return Promise<ResponseMessageType>
   */
  public async forgotPassword(forgotPasswordRequest: ForgotPasswordRequest): Promise<ResponseMessageType> {
    const user: UserEntity = await this.userService.findUserByEmail(forgotPasswordRequest.email);

    if (!user) {
      throw new ForbiddenException('User not found.');
    }

    const temporaryLink: string = this.encryptTemporaryLink(user.id);
    const verifyUrl = `${appConfig.url}/auth/password-reset/${temporaryLink}`;

    await this.mailService.sendResetPassword(user.email, verifyUrl);

    return { data: 'Email for reset password send.' };
  }

  /**
   * @function Change user password.
   * @access public
   * @param link:string
   * @param passwordResetRequest:PasswordResetRequest
   * @return Promise<ResponseMessageType>
   */
  public async passwordReset(link: string, passwordResetRequest: PasswordResetRequest): Promise<ResponseMessageType> {
    const userId: number = await this.decryptTemporaryLink(link);
    const user: UserEntity = await this.userService.changePassword(userId, passwordResetRequest.password);

    if (!user) {
      throw new ForbiddenException('Error change password.');
    }

    return { data: 'Password successes changed.' };
  }

  /**
   * @function Encrypt temporary link.
   * @access private
   * @param userId:number
   * @return string
   */
  private encryptTemporaryLink(userId: number): string {
    const convertToJson: string = JSON.stringify({ userId });

    return this.cryptoService.encrypt(convertToJson, appConfig.secret, appConfig.iv);
  }

  /**
   * @function Decrypt temporary link.
   * @access private
   * @param cryptLink:string
   * @return string
   */
  private async decryptTemporaryLink(cryptLink: string): Promise<number> {
    const decodeVerify: string = this.cryptoService.decrypt(cryptLink, appConfig.secret, appConfig.iv);
    const { userId }: { userId: number } = await JSON.parse(decodeVerify);

    return userId;
  }

  /**
   * @function Validation user credentials.
   * @access private
   * @param email:string
   * @param password:string
   * @return Promise<UserEntity|null>
   */
  private async validateUser(email: string, password: string): Promise<UserEntity | null> {
    const user: UserEntity = await this.userService.findUserByEmail(email);

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        return user;
      }
    }

    return null;
  }
}
