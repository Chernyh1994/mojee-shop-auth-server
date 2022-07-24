import express, { Request, Response, Router } from 'express';
import { Inject, Service } from 'typedi';
import asyncHandler from 'express-async-handler';
import AuthController from '../src/controllers/auth.controller';

@Service()
export default class ApiRoute {
  @Inject()
  private authController: AuthController;

  private readonly router: Router;

  constructor() {
    this.router = express.Router();
  }

  public init() {
    this.router.post('/auth/registration');
    this.router.post(
      '/auth/login',
      asyncHandler((req: Request, res: Response) =>
        this.authController.login(req, res),
      ),
    );
    this.router.post('/auth/logout');
    this.router.get('/auth/verify/:link');
    this.router.post('/auth/forgot-password');
    this.router.post('/auth/reset-password');
    this.router.get('/auth/refresh');

    return this.router;
  }
}
