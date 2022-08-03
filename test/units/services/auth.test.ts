import { NextFunction, Request, Response } from 'express';
import AuthService from '../../../src/services/auth.service';
import { ResponseMessageType, ResponseTokensType } from '../../../src/commons/types/response.type';
import { HttpStatusCode } from '../../../src/commons/enums/http-startus-code.enum';
import HttpException from '../../../src/commons/exceptions/http/http.exception';
import ForbiddenException from '../../../src/commons/exceptions/http/forbidden.exception';
import errorHandlerMiddleware from '../../../src/middlewares/error-handler.middleware';
import UserService from '../../../src/services/user.service';
import TokenService from '../../../src/services/token.service';
import MailService from '../../../src/services/mail.service';
import CryptoService from '../../../src/services/crypto.service';
import { UserEntity } from '../../../src/entity/user.entity';
import { RegistrationRequest } from '../../../src/http/requests/auth/registration.request';
import { LoginRequest } from '../../../src/http/requests/auth/login.request';
import UnauthorizedException from '../../../src/commons/exceptions/http/unauthorized.exception';

describe('AuthService', () => {
  let authService: AuthService;
  let resMock: Response;
  let reqMock: Request;
  let nextMock: NextFunction;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const userServiceMock: jest.Mocked<UserService> = {
    createUser: jest.fn(),
    findUserByEmail: jest.fn(),
    verifyUser: jest.fn(),
    changePassword: jest.fn(),
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const tokenServiceMock: jest.Mocked<TokenService> = {
    generateTokens: jest.fn(),
    refreshTokens: jest.fn(),
    deleteRefreshToken: jest.fn(),
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const mailServiceMock: jest.Mocked<MailService> = {
    sendVerificationLink: jest.fn(),
    sendResetPassword: jest.fn(),
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const cryptoServiceMock: jest.Mocked<CryptoService> = {
    encrypt: jest.fn(),
    decrypt: jest.fn(),
  };

  beforeEach(() => {
    resMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    } as unknown as Response;

    reqMock = {
      method: jest.fn(),
      body: jest.fn(),
    } as unknown as Request;

    nextMock = jest.fn();
    authService = new AuthService(userServiceMock, tokenServiceMock, mailServiceMock, cryptoServiceMock);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('registration', () => {
    test('Should return access token and refresh token;', async () => {
      const registrationRequestMock: RegistrationRequest = {
        email: jest.fn(),
        password: jest.fn(),
      } as unknown as RegistrationRequest;
      const user: UserEntity = {
        id: 2,
        email: 'test@test.com',
        password: '$2b$10$kBSeGVlnHjdtUlhhrxsX3.4huPqCW/xNBsLNKlclqx6fEtEuRyOG2',
        is_verified: false,
        is_deleted: false,
        profile_id: null,
        role_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      };
      const tokens: ResponseTokensType = {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjY3LCJpYXQiOjE2NTk1MjY3MTIsImV4cCI6MTY1OTUzMDMxMn0.TWzhQiVmOVboTpKpT_ZXykG7Ksqh7WNYa-36VpUpHwI',
        refreshToken:
          '312baf653be5e165db266a0d421a1bbbf5bb35617b1b72b9bfb911c8046370a53e6b6238cf0728e1774c40b0bf701e49',
      };

      userServiceMock.createUser.mockResolvedValue(user);
      mailServiceMock.sendVerificationLink.mockResolvedValue();
      tokenServiceMock.generateTokens.mockResolvedValue(tokens);
      const result = await authService.registration(registrationRequestMock);

      expect(userServiceMock.createUser).toBeCalledWith(registrationRequestMock);
      expect(userServiceMock.createUser).toBeCalledTimes(1);
      expect(mailServiceMock.sendVerificationLink).toBeCalledWith(user.email, 'undefined/auth/verify/undefined');
      expect(mailServiceMock.sendVerificationLink).toBeCalledTimes(1);
      expect(tokenServiceMock.generateTokens).toBeCalledWith(user.id);
      expect(tokenServiceMock.generateTokens).toBeCalledTimes(1);
      expect(result).toBe(tokens);
    });

    test('Should return a Forbidden Exception for the registration method;', async () => {
      const forbiddenException: HttpException = new ForbiddenException('Email is not available.');
      userServiceMock.createUser.mockRejectedValue(forbiddenException);
      errorHandlerMiddleware(forbiddenException, reqMock, resMock, nextMock);

      await expect(userServiceMock.createUser).rejects.toThrow(Error);
      expect(resMock.status).toBeCalledWith(HttpStatusCode.FORBIDDEN);
      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.json).toBeCalledWith({ error: 'Email is not available.', status: 403 });
      expect(resMock.json).toBeCalledTimes(1);
      expect(nextMock).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginRequestMock: LoginRequest = {
      email: jest.fn(),
      password: jest.fn(),
    } as unknown as LoginRequest;

    test('Should return access token and refresh token;', async () => {
      const user: UserEntity = {
        id: 2,
        email: 'test@test.com',
        password: '$2b$10$kBSeGVlnHjdtUlhhrxsX3.4huPqCW/xNBsLNKlclqx6fEtEuRyOG2',
        is_verified: false,
        is_deleted: false,
        profile_id: null,
        role_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      };
      const tokens: ResponseTokensType = {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjY3LCJpYXQiOjE2NTk1MjY3MTIsImV4cCI6MTY1OTUzMDMxMn0.TWzhQiVmOVboTpKpT_ZXykG7Ksqh7WNYa-36VpUpHwI',
        refreshToken:
          '312baf653be5e165db266a0d421a1bbbf5bb35617b1b72b9bfb911c8046370a53e6b6238cf0728e1774c40b0bf701e49',
      };
      const validateUser = jest.spyOn(AuthService.prototype as any, 'validateUser');

      validateUser.mockImplementation(() => user);
      tokenServiceMock.generateTokens.mockResolvedValue(tokens);
      const result = await authService.login(loginRequestMock);

      expect(validateUser).toHaveBeenCalled();
      expect(tokenServiceMock.generateTokens).toBeCalledWith(user.id);
      expect(tokenServiceMock.generateTokens).toBeCalledTimes(1);
      expect(result).toBe(tokens);
    });

    test('Should return a Unauthorized Exception for the login method;', async () => {
      const unauthorizedException: HttpException = new UnauthorizedException('Incorrect username or password.');
      const validateUser = jest.spyOn(AuthService.prototype as any, 'validateUser');

      validateUser.mockImplementation(() => null);
      errorHandlerMiddleware(unauthorizedException, reqMock, resMock, nextMock);

      await expect(authService.login(loginRequestMock)).rejects.toThrow(Error);
      expect(resMock.status).toBeCalledWith(HttpStatusCode.UNAUTHORIZED);
      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.json).toBeCalledWith({ error: 'Incorrect username or password.', status: 401 });
      expect(resMock.json).toBeCalledTimes(1);
      expect(nextMock).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    const refreshToken =
      '312baf653be5e165db266a0d421a1bbbf5bb35617b1b72b9bfb911c8046370a53e6b6238cf0728e1774c40b0bf701e49';

    test('Should return message: Logout success;', async () => {
      const responseMessage: ResponseMessageType = { data: 'Logout success.' };

      tokenServiceMock.deleteRefreshToken.mockResolvedValue(true);
      const result = await authService.logout(refreshToken);

      expect(tokenServiceMock.deleteRefreshToken).toBeCalledWith(refreshToken);
      expect(tokenServiceMock.deleteRefreshToken).toBeCalledTimes(1);
      expect(result).toStrictEqual(responseMessage);
    });

    test('Should return a Forbidden Exception for the logout method;', async () => {
      const forbiddenException: HttpException = new ForbiddenException('Error logout.');

      tokenServiceMock.deleteRefreshToken.mockResolvedValue(false);
      errorHandlerMiddleware(forbiddenException, reqMock, resMock, nextMock);

      await expect(authService.logout(refreshToken)).rejects.toThrow(Error);
      expect(resMock.status).toBeCalledWith(HttpStatusCode.FORBIDDEN);
      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.json).toBeCalledWith({ error: 'Error logout.', status: 403 });
      expect(resMock.json).toBeCalledTimes(1);
      expect(nextMock).not.toHaveBeenCalled();
    });
  });
});
