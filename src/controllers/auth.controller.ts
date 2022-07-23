import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import BaseController from './base.controller';
import AuthService from '../services/auth.service';

@Service()
export default class AuthController extends BaseController {
  @Inject()
  private authService: AuthService;

  constructor() {
    super();
  }

  public async login(req: Request, res: Response): Promise<void> {
    const test = await this.authService.login('AuthController');
    res.status(200).json(test);
  }
}
