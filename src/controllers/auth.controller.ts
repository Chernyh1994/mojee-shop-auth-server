import { Request, Response } from 'express';
import { POST, route } from 'awilix-express';
import BaseController from './base.controller';
import AuthService from '../services/auth.service';

@route('/auth')
export default class AuthController extends BaseController {
  constructor(private authService: AuthService) {
    super();
  }

  @route('/login')
  @POST()
  public async login(req: Request, res: Response): Promise<void> {
    const test = await this.authService.login();
    res.status(200).json(test);
  }
}
