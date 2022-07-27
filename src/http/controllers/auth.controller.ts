import { Request, Response } from 'express';
import { GET, POST, route } from 'awilix-express';
import AuthService from '../../services/auth.service';

@route('/auth')
export default class AuthController {
  constructor(private authService: AuthService) {}

  @route('/registration')
  @POST()
  public async registration(req: Request, res: Response): Promise<void> {
    res.status(200).json('ddd');
  }

  @route('/login')
  @POST()
  public async login(req: Request, res: Response): Promise<void> {
    const test = await this.authService.login(req);
    res.status(200).json(test);
  }

  @route('/logout')
  @POST()
  public async logout(req: Request, res: Response): Promise<void> {
    res.status(200).json('ddd');
  }

  @route('/verify/:link')
  @GET()
  public async verify(req: Request, res: Response): Promise<void> {
    res.status(200).json('ddd');
  }

  @route('/password-forgot')
  @GET()
  public async passwordForgot(req: Request, res: Response): Promise<void> {
    res.status(200).json('ddd');
  }

  @route('/password-reset')
  @POST()
  public async passwordReset(req: Request, res: Response): Promise<void> {
    res.status(200).json('ddd');
  }

  @route('/refresh')
  @GET()
  public async refresh(req: Request, res: Response): Promise<void> {
    res.status(200).json('ddd');
  }
}
