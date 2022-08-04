import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import AuthController from '../../../src/http/controllers/auth.controller';
import AuthService from '../../../src/services/auth.service';
import { ResponseMessageType, ResponseTokensType } from '../../../src/commons/types/response.type';
import { HttpStatusCode } from '../../../src/commons/enums/http-startus-code.enum';
import errorHandlerMiddleware from '../../../src/middlewares/error-handler.middleware';
import ForbiddenException from '../../../src/commons/exceptions/http/forbidden.exception';
import HttpException from '../../../src/commons/exceptions/http/http.exception';
import UnauthorizedException from '../../../src/commons/exceptions/http/unauthorized.exception';

describe('AuthController', () => {
  let authController: AuthController;
  let resMock: Response;
  let nextMock: NextFunction;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const authServiceMock: jest.Mocked<AuthService> = {
    registration: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    verifyUser: jest.fn(),
    refresh: jest.fn(),
    forgotPassword: jest.fn(),
    passwordReset: jest.fn(),
  };

  beforeEach(() => {
    resMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    } as unknown as Response;

    nextMock = jest.fn();
    authController = new AuthController(authServiceMock);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('registration', () => {
    test('Should return access token and refresh token;', async () => {
      const reqMock: Request = {
        method: 'post',
        body: {
          email: 'testOne@test.com',
          password: 'Test123!@#',
        },
      } as unknown as Request;
      const result: ResponseTokensType = {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjY3LCJpYXQiOjE2NTk1MjY3MTIsImV4cCI6MTY1OTUzMDMxMn0.TWzhQiVmOVboTpKpT_ZXykG7Ksqh7WNYa-36VpUpHwI',
        refreshToken:
          '312baf653be5e165db266a0d421a1bbbf5bb35617b1b72b9bfb911c8046370a53e6b6238cf0728e1774c40b0bf701e49',
      };

      authServiceMock.registration.mockResolvedValue(result);
      await authController.registration(reqMock, resMock);

      expect(authServiceMock.registration).toBeCalledWith(reqMock.body);
      expect(authServiceMock.registration).toBeCalledTimes(1);
      expect(resMock.status).toBeCalledWith(HttpStatusCode.CREATED);
      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.json).toBeCalledWith(result);
      expect(resMock.json).toBeCalledTimes(1);
    });

    test('Should return a Forbidden Exception for the registration method;', async () => {
      const reqMock: Request = {
        method: 'post',
        body: {
          email: 'testOne@test.com',
          password: 'Test123!@#',
        },
      } as unknown as Request;

      const forbiddenException: HttpException = new ForbiddenException('Registration error message.');
      authServiceMock.registration.mockRejectedValue(forbiddenException);
      errorHandlerMiddleware(forbiddenException, reqMock, resMock, nextMock);

      await expect(authServiceMock.registration).rejects.toThrow(Error);
      expect(resMock.status).toBeCalledWith(HttpStatusCode.FORBIDDEN);
      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.json).toBeCalledWith({ error: 'Registration error message.', status: 403 });
      expect(resMock.json).toBeCalledTimes(1);
      expect(nextMock).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    test('Should return access token and refresh token;', async () => {
      const reqMock: Request = {
        method: 'post',
        body: {
          email: 'testOne@test.com',
          password: 'Test123!@#',
        },
      } as unknown as Request;
      const result: ResponseTokensType = {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjY3LCJpYXQiOjE2NTk1MjY3MTIsImV4cCI6MTY1OTUzMDMxMn0.TWzhQiVmOVboTpKpT_ZXykG7Ksqh7WNYa-36VpUpHwI',
        refreshToken:
          '312baf653be5e165db266a0d421a1bbbf5bb35617b1b72b9bfb911c8046370a53e6b6238cf0728e1774c40b0bf701e49',
      };

      authServiceMock.login.mockResolvedValue(result);
      await authController.login(reqMock, resMock);

      expect(authServiceMock.login).toBeCalledWith(reqMock.body);
      expect(authServiceMock.login).toBeCalledTimes(1);
      expect(resMock.status).toBeCalledWith(HttpStatusCode.OK);
      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.json).toBeCalledWith(result);
      expect(resMock.json).toBeCalledTimes(1);
    });

    test('Should return a Forbidden Exception for the login method;', async () => {
      const reqMock: Request = {
        method: 'post',
        body: {
          email: 'testOne@test.com',
          password: 'Test123!@#',
        },
      } as unknown as Request;

      const forbiddenException: HttpException = new ForbiddenException('Login error message.');
      authServiceMock.login.mockRejectedValue(forbiddenException);
      errorHandlerMiddleware(forbiddenException, reqMock, resMock, nextMock);

      await expect(authServiceMock.login).rejects.toThrow(Error);
      expect(resMock.status).toBeCalledWith(HttpStatusCode.FORBIDDEN);
      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.json).toBeCalledWith({ error: 'Login error message.', status: 403 });
      expect(resMock.json).toBeCalledTimes(1);
      expect(nextMock).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    test('Should return message: Logout success;', async () => {
      const reqMock: Request = {
        method: 'post',
        cookies: {
          refreshToken:
            '312baf653be5e165db266a0d421a1bbbf5bb35617b1b72b9bfb911c8046370a53e6b6238cf0728e1774c40b0bf701e49',
        },
      } as unknown as Request;
      const result: ResponseMessageType = { data: 'Logout success' };

      authServiceMock.logout.mockResolvedValue(result);
      await authController.logout(reqMock, resMock);

      expect(authServiceMock.logout).toBeCalledWith(reqMock.cookies.refreshToken);
      expect(authServiceMock.logout).toBeCalledTimes(1);
      expect(resMock.status).toBeCalledWith(HttpStatusCode.OK);
      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.json).toBeCalledWith(result);
      expect(resMock.json).toBeCalledTimes(1);
    });

    test('Should return a Forbidden Exception for the logout method;', async () => {
      const reqMock: Request = {
        method: 'post',
        cookies: {
          refreshToken:
            '312baf653be5e165db266a0d421a1bbbf5bb35617b1b72b9bfb911c8046370a53e6b6238cf0728e1774c40b0bf701e49',
        },
      } as unknown as Request;

      const forbiddenException: HttpException = new ForbiddenException('Logout error message.');
      authServiceMock.logout.mockRejectedValue(forbiddenException);
      errorHandlerMiddleware(forbiddenException, reqMock, resMock, nextMock);

      await expect(authServiceMock.logout).rejects.toThrow(Error);
      expect(resMock.status).toBeCalledWith(HttpStatusCode.FORBIDDEN);
      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.json).toBeCalledWith({ error: 'Logout error message.', status: 403 });
      expect(resMock.json).toBeCalledTimes(1);
      expect(nextMock).not.toHaveBeenCalled();
    });
  });

  describe('verify', () => {
    test('Should return message: User has been verified;', async () => {
      const reqMock: Request = {
        method: 'get',
        params: {
          link: '7fbe495dc4d893c6f2202785d06d3bed',
        },
      } as unknown as Request;
      const result: ResponseMessageType = { data: 'User has been verified' };

      authServiceMock.verifyUser.mockResolvedValue(result);
      await authController.verify(reqMock, resMock);

      expect(authServiceMock.verifyUser).toBeCalledWith(reqMock.params.link);
      expect(authServiceMock.verifyUser).toBeCalledTimes(1);
      expect(resMock.status).toBeCalledWith(HttpStatusCode.OK);
      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.json).toBeCalledWith(result);
      expect(resMock.json).toBeCalledTimes(1);
    });

    test('Should return a Forbidden Exception for the verified method;', async () => {
      const reqMock: Request = {
        method: 'get',
        params: {
          link: '7fbe495dc4d893c6f2202785d06d3bed',
        },
      } as unknown as Request;

      const forbiddenException: HttpException = new ForbiddenException('User not verified.');
      authServiceMock.verifyUser.mockRejectedValue(forbiddenException);
      errorHandlerMiddleware(forbiddenException, reqMock, resMock, nextMock);

      await expect(authServiceMock.verifyUser).rejects.toThrow(Error);
      expect(resMock.status).toBeCalledWith(HttpStatusCode.FORBIDDEN);
      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.json).toBeCalledWith({ error: 'User not verified.', status: 403 });
      expect(resMock.json).toBeCalledTimes(1);
      expect(nextMock).not.toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    test('Should return access token and refresh token;', async () => {
      const reqMock: Request = {
        method: 'get',
        cookies: {
          refreshToken:
            '312baf653be5e165db246a0d421a1bbbf5bb37617b1b72b9bfb911c8046370a53e6b6238cf0728e1774c40b0bf701e40',
        },
      } as unknown as Request;
      const result: ResponseTokensType = {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjY3LCJpYXQiOjE2NTk1MjY3MTIsImV4cCI6MTY1OTUzMDMxMn0.TWzhQiVmOVboTpKpT_ZXykG7Ksqh7WNYa-36VpUpHwI',
        refreshToken:
          '312baf653be5e165db266a0d421a1bbbf5bb35617b1b72b9bfb911c8046370a53e6b6238cf0728e1774c40b0bf701e49',
      };

      authServiceMock.refresh.mockResolvedValue(result);
      await authController.refresh(reqMock, resMock);

      expect(authServiceMock.refresh).toBeCalledWith(reqMock.cookies.refreshToken);
      expect(authServiceMock.refresh).toBeCalledTimes(1);
      expect(resMock.status).toBeCalledWith(HttpStatusCode.OK);
      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.json).toBeCalledWith(result);
      expect(resMock.json).toBeCalledTimes(1);
    });

    test('Should return a Unauthorized Exception for the refresh method;', async () => {
      const reqMock: Request = {
        method: 'get',
        cookies: {
          refreshToken:
            '312baf653be5e165db246a0d421a1bbbf5bb37617b1b72b9bfb911c8046370a53e6b6238cf0728e1774c40b0bf701e40',
        },
      } as unknown as Request;

      const unauthorizedException: HttpException = new UnauthorizedException('Unauthorized.');
      authServiceMock.refresh.mockRejectedValue(unauthorizedException);
      errorHandlerMiddleware(unauthorizedException, reqMock, resMock, nextMock);

      await expect(authServiceMock.refresh).rejects.toThrow(Error);
      expect(resMock.status).toBeCalledWith(HttpStatusCode.UNAUTHORIZED);
      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.json).toBeCalledWith({ error: 'Unauthorized.', status: 401 });
      expect(resMock.json).toBeCalledTimes(1);
      expect(nextMock).not.toHaveBeenCalled();
    });
  });

  describe('forgotPassword', () => {
    test('Should return message: Email for reset password send;', async () => {
      const reqMock: Request = {
        method: 'post',
        body: {
          email: 'testOne@test.com',
        },
      } as unknown as Request;
      const result: ResponseMessageType = { data: 'Email for reset password send.' };

      authServiceMock.forgotPassword.mockResolvedValue(result);
      await authController.forgotPassword(reqMock, resMock);

      expect(authServiceMock.forgotPassword).toBeCalledWith(reqMock.body);
      expect(authServiceMock.forgotPassword).toBeCalledTimes(1);
      expect(resMock.status).toBeCalledWith(HttpStatusCode.OK);
      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.json).toBeCalledWith(result);
      expect(resMock.json).toBeCalledTimes(1);
    });

    test('Should return a Forbidden Exception for the forgotPassword method;', async () => {
      const reqMock: Request = {
        method: 'post',
        body: {
          email: 'testOne@test.com',
        },
      } as unknown as Request;

      const forbiddenException: HttpException = new ForbiddenException('User not found.');
      authServiceMock.forgotPassword.mockRejectedValue(forbiddenException);
      errorHandlerMiddleware(forbiddenException, reqMock, resMock, nextMock);

      await expect(authServiceMock.forgotPassword).rejects.toThrow(Error);
      expect(resMock.status).toBeCalledWith(HttpStatusCode.FORBIDDEN);
      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.json).toBeCalledWith({ error: 'User not found.', status: 403 });
      expect(resMock.json).toBeCalledTimes(1);
      expect(nextMock).not.toHaveBeenCalled();
    });
  });

  describe('passwordReset', () => {
    test('Should return message: Password successes changed;', async () => {
      const reqMock: Request = {
        method: 'post',
        body: {
          password: 'Test123!@#',
        },
        params: {
          link: 'ec7089f370eed3b1c2261be47e33e5d0',
        },
      } as unknown as Request;
      const result: ResponseMessageType = { data: 'Password successes changed.' };

      authServiceMock.passwordReset.mockResolvedValue(result);
      await authController.passwordReset(reqMock, resMock);

      expect(authServiceMock.passwordReset).toBeCalledWith(reqMock.params.link, reqMock.body);
      expect(authServiceMock.passwordReset).toBeCalledTimes(1);
      expect(resMock.status).toBeCalledWith(HttpStatusCode.OK);
      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.json).toBeCalledWith(result);
      expect(resMock.json).toBeCalledTimes(1);
    });

    test('Should return a Forbidden Exception for the passwordReset method;', async () => {
      const reqMock: Request = {
        method: 'post',
        body: {
          password: 'Test123!@#',
        },
        params: {
          link: 'ec7089f370eed3b1c2261be47e33e5d0',
        },
      } as unknown as Request;

      const forbiddenException: HttpException = new ForbiddenException('Error change password.');
      authServiceMock.passwordReset.mockRejectedValue(forbiddenException);
      errorHandlerMiddleware(forbiddenException, reqMock, resMock, nextMock);

      await expect(authServiceMock.passwordReset).rejects.toThrow(Error);
      expect(resMock.status).toBeCalledWith(HttpStatusCode.FORBIDDEN);
      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.json).toBeCalledWith({ error: 'Error change password.', status: 403 });
      expect(resMock.json).toBeCalledTimes(1);
      expect(nextMock).not.toHaveBeenCalled();
    });
  });
});
