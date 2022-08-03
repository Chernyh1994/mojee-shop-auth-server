import { Request, Response } from 'express';
import { GET, POST, route } from 'awilix-express';
import { HttpStatusCode } from '../../commons/enums/http-startus-code.enum';
import { ValidationBody } from '../../commons/decorators/validation.decorator';
import { ResponseTokensType, ResponseMessageType } from '../../commons/types/response.type';
import { LoginRequest } from '../requests/auth/login.request';
import { RegistrationRequest } from '../requests/auth/registration.request';
import { ForgotPasswordRequest } from '../requests/auth/forgot-password.request';
import { PasswordResetRequest } from '../requests/auth/password-reset.request';
import AuthService from '../../services/auth.service';

/**
 * AuthController class.
 */
@route('/auth')
export default class AuthController {
  /**
   * @constructor
   */
  constructor(
    /**
     * AuthService Dependency Injection.
     *
     * @access private
     * @type AuthService
     */
    private authService: AuthService,
  ) {}

  /**
   * @function Create and authentication a new user.
   * @access public
   * @param req:Request
   * @param res:Response
   * @return Promise<void>
   */
  @route('/registration')
  @POST()
  @ValidationBody(RegistrationRequest)
  public async registration(req: Request, res: Response): Promise<void> {
    const registrationRequest: RegistrationRequest = req.body;
    const tokens: ResponseTokensType = await this.authService.registration(registrationRequest);

    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 30 * 24 * 60,
      httpOnly: true,
    });
    res.status(HttpStatusCode.CREATED).json(tokens);
  }

  /**
   * @function Authentication exist user.
   * @access public
   * @param req:Request
   * @param res:Response
   * @return Promise<void>
   */
  @route('/login')
  @POST()
  @ValidationBody(LoginRequest)
  public async login(req: Request, res: Response): Promise<void> {
    const loginRequest: LoginRequest = req.body;
    const tokens: ResponseTokensType = await this.authService.login(loginRequest);

    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 30 * 24 * 60,
      httpOnly: true,
    });
    res.status(HttpStatusCode.OK).json(tokens);
  }

  /**
   * @function User logout.
   * @access public
   * @param req:Request
   * @param res:Response
   * @return Promise<void>
   */
  @route('/logout')
  @POST()
  public async logout(req: Request, res: Response): Promise<void> {
    const { refreshToken }: { refreshToken: string } = req.cookies;
    const responseMessage: ResponseMessageType = await this.authService.logout(refreshToken);

    res.status(HttpStatusCode.OK).json(responseMessage);
  }

  /**
   * @function Verify a user account.
   * @access public
   * @param req:Request
   * @param res:Response
   * @return Promise<void>
   */
  @route('/verify/:link')
  @GET()
  public async verify(req: Request, res: Response): Promise<void> {
    const link: string = req.params.link;
    const responseMessage: ResponseMessageType = await this.authService.verifyUser(link);

    res.status(HttpStatusCode.OK).json(responseMessage);
  }

  /**
   * @function Refresh JWT access token.
   * @access public
   * @param req:Request
   * @param res:Response
   * @return Promise<void>
   */
  @route('/refresh')
  @GET()
  public async refresh(req: Request, res: Response): Promise<void> {
    const { refreshToken }: { refreshToken: string } = req.cookies;
    const tokens: ResponseTokensType = await this.authService.refresh(refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 30 * 24 * 60,
      httpOnly: true,
    });
    res.status(HttpStatusCode.OK).json(tokens);
  }

  /**
   * @function Send password reset email.
   * @access public
   * @param req:Request
   * @param res:Response
   * @return Promise<void>
   */
  @route('/forgot-password')
  @POST()
  @ValidationBody(ForgotPasswordRequest)
  public async forgotPassword(req: Request, res: Response): Promise<void> {
    const forgotPasswordRequest: ForgotPasswordRequest = req.body;
    const responseMessage: ResponseMessageType = await this.authService.forgotPassword(forgotPasswordRequest);

    res.status(HttpStatusCode.OK).json(responseMessage);
  }

  /**
   * @function Change user password.
   * @access public
   * @param req:Request
   * @param res:Response
   * @return Promise<void>
   */
  @route('/password-reset/:link')
  @POST()
  @ValidationBody(PasswordResetRequest)
  public async passwordReset(req: Request, res: Response): Promise<void> {
    const passwordResetRequest: PasswordResetRequest = req.body;
    const link: string = req.params.link;
    const responseMessage: ResponseMessageType = await this.authService.passwordReset(link, passwordResetRequest);

    res.status(HttpStatusCode.OK).json(responseMessage);
  }
}
