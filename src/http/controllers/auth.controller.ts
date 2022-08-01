import { Request, Response } from 'express';
import { GET, POST, route } from 'awilix-express';
import { HttpStatusCode } from '../../commons/enums/http-startus-code.enum';
import { ValidationBody } from '../../commons/decorators/validation.decorator';
import { LoginRequest } from '../requests/auth/login.request';
import { RegistrationRequest } from '../requests/auth/registration.request';
import { ForgotPasswordRequest } from '../requests/auth/forgot-password.request';
import { PasswordResetRequest } from '../requests/auth/password-reset.request';
import AuthService from '../../services/auth.service';

@route('/auth')
export default class AuthController {
  constructor(private authService: AuthService) {}

  @route('/registration')
  @POST()
  @ValidationBody(RegistrationRequest)
  public async registration(req: Request, res: Response): Promise<void> {
    const data: { [key: string]: string } = await this.authService.registration(
      req.body,
    );
    res.cookie('refreshToken', data.refresh_token, {
      maxAge: 30 * 24 * 60,
      httpOnly: true,
    });
    res.status(HttpStatusCode.CREATED).json(data);
  }

  @route('/login')
  @POST()
  @ValidationBody(LoginRequest)
  public async login(req: Request, res: Response): Promise<void> {
    const data: { [key: string]: string } = await this.authService.login(
      req.body,
    );
    res.cookie('refreshToken', data.refresh_token, {
      maxAge: 30 * 24 * 60,
      httpOnly: true,
    });
    res.status(HttpStatusCode.OK).json(data);
  }

  @route('/logout')
  @POST()
  public async logout(req: Request, res: Response): Promise<void> {
    const { refreshToken }: { refreshToken: string } = req.cookies;
    const data: { [key: string]: string } = await this.authService.logout(
      refreshToken,
    );
    res.status(HttpStatusCode.OK).json(data);
  }

  @route('/verify/:link')
  @GET()
  public async verify(req: Request, res: Response): Promise<void> {
    const data: { [key: string]: string } = await this.authService.verifyUser(
      req.params.link,
    );
    res.status(HttpStatusCode.OK).json(data);
  }

  @route('/refresh')
  @GET()
  public async refresh(req: Request, res: Response): Promise<void> {
    const { refreshToken }: { refreshToken: string } = req.cookies;
    const data: { [key: string]: string } = await this.authService.refresh(
      refreshToken,
    );
    res.cookie('refreshToken', data.refresh_token, {
      maxAge: 30 * 24 * 60,
      httpOnly: true,
    });
    res.status(HttpStatusCode.OK).json(data);
  }

  @route('/forgot-password')
  @POST()
  @ValidationBody(ForgotPasswordRequest)
  public async forgotPassword(req: Request, res: Response): Promise<void> {
    const data: { [key: string]: string } =
      await this.authService.forgotPassword(req.body.email);
    res.status(HttpStatusCode.OK).json(data);
  }

  @route('/password-reset/:link')
  @POST()
  @ValidationBody(PasswordResetRequest)
  public async passwordReset(req: Request, res: Response): Promise<void> {
    const data: { [key: string]: string } =
      await this.authService.passwordReset(req.params.link, req.body.password);
    res.status(HttpStatusCode.OK).json(data);
  }
}
