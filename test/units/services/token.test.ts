import { NextFunction, Request, Response } from 'express';
import HttpException from '../../../src/commons/exceptions/http/http.exception';
import ForbiddenException from '../../../src/commons/exceptions/http/forbidden.exception';
import errorHandlerMiddleware from '../../../src/middlewares/error-handler.middleware';
import { HttpStatusCode } from '../../../src/commons/enums/http-startus-code.enum';
import TokenService from '../../../src/services/token.service';
import TokenRepository from '../../../src/repositories/token.repository';
import CryptoService from '../../../src/services/crypto.service';
import { ResponseTokensType } from '../../../src/commons/types/response.type';
import { TokenEntity } from '../../../src/entity/token.entity';
import { UpdateTokenDto } from '../../../src/commons/dto/services/token/update-token.dto';
import { authConfig } from '../../../config/auth.config';
import UnauthorizedException from '../../../src/commons/exceptions/http/unauthorized.exception';

describe('TokenService', () => {
  let tokenService: TokenService;
  let resMock: Response;
  let reqMock: Request;
  let nextMock: NextFunction;
  let responseTokensTypeMock: ResponseTokensType;
  let tokenEntityMock: TokenEntity;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const tokenRepositoryMock: jest.Mocked<TokenRepository> = {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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

    responseTokensTypeMock = {
      accessToken: jest.fn().toString(),
      refreshToken: jest.fn().toString(),
    } as unknown as ResponseTokensType;

    tokenEntityMock = jest.fn() as unknown as TokenEntity;

    tokenService = new TokenService(tokenRepositoryMock, cryptoServiceMock);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('generateTokens', () => {
    test('Should return tokens;', async () => {
      const userIdMock = jest.fn().length;
      const generateJwtAccessTokenMock = jest.spyOn(TokenService.prototype as any, 'generateJwtAccessToken');
      generateJwtAccessTokenMock.mockReturnValueOnce(jest.fn().toString());
      const generateRefreshTokenMock = jest.spyOn(TokenService.prototype as any, 'generateRefreshToken');
      generateRefreshTokenMock.mockResolvedValue(jest.fn().toString());
      const result = await tokenService.generateTokens(userIdMock);

      expect(generateJwtAccessTokenMock).toBeCalledWith(userIdMock);
      expect(generateJwtAccessTokenMock).toBeCalledTimes(1);
      expect(generateRefreshTokenMock).toBeCalledWith(userIdMock);
      expect(generateRefreshTokenMock).toBeCalledTimes(1);
      expect(result).toStrictEqual(responseTokensTypeMock);
    });

    test('Should return a Forbidden Exception for the generateTokens method;', async () => {
      const forbiddenException: HttpException = new ForbiddenException('Token Error.');
      const generateJwtAccessTokenMock = jest.spyOn(TokenService.prototype as any, 'generateJwtAccessToken');
      generateJwtAccessTokenMock.mockRejectedValue(forbiddenException);
      errorHandlerMiddleware(forbiddenException, reqMock, resMock, nextMock);

      await expect(generateJwtAccessTokenMock).rejects.toThrow(Error);
      expect(resMock.status).toBeCalledWith(HttpStatusCode.FORBIDDEN);
      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.json).toBeCalledWith({ error: 'Token Error.', status: HttpStatusCode.FORBIDDEN });
      expect(resMock.json).toBeCalledTimes(1);
      expect(nextMock).not.toHaveBeenCalled();
    });
  });

  describe('refreshTokens', () => {
    const refreshTokenMock = jest.fn().toString();

    test('Should return tokens;', async () => {
      // const tokenDataMock: UpdateTokenDto = {
      //   expires_in: authConfig.expireInRefresh,
      // } as unknown as UpdateTokenDto;
      const oldRefreshTokenMock = jest.fn().toString();
      const decryptRefreshTokenMock = jest.spyOn(TokenService.prototype as any, 'decryptRefreshToken');
      decryptRefreshTokenMock.mockReturnValueOnce(jest.fn().toString());
      const validateRefreshTokenMock = jest.spyOn(TokenService.prototype as any, 'validateRefreshToken');
      validateRefreshTokenMock.mockResolvedValue(jest.fn().toString());
      tokenRepositoryMock.update.mockResolvedValue(tokenEntityMock);
      const generateJwtAccessTokenMock = jest.spyOn(TokenService.prototype as any, 'generateJwtAccessToken');
      generateJwtAccessTokenMock.mockReturnValueOnce(jest.fn().toString());
      const encryptRefreshTokenMock = jest.spyOn(TokenService.prototype as any, 'encryptRefreshToken');
      encryptRefreshTokenMock.mockReturnValueOnce(jest.fn().toString());
      const result = await tokenService.refreshTokens(refreshTokenMock);

      expect(decryptRefreshTokenMock).toBeCalledWith(refreshTokenMock);
      expect(decryptRefreshTokenMock).toBeCalledTimes(1);
      expect(validateRefreshTokenMock).toBeCalledWith(oldRefreshTokenMock);
      expect(validateRefreshTokenMock).toBeCalledTimes(1);
      // expect(tokenRepositoryMock.update).toBeCalledWith(tokenEntityMock.id, tokenDataMock);
      expect(tokenRepositoryMock.update).toBeCalledTimes(1);
      expect(generateJwtAccessTokenMock).toBeCalledWith(tokenEntityMock.id);
      expect(generateJwtAccessTokenMock).toBeCalledTimes(1);
      expect(encryptRefreshTokenMock).toBeCalledWith(tokenEntityMock.refresh_token);
      expect(encryptRefreshTokenMock).toBeCalledTimes(1);

      expect(result).toStrictEqual(responseTokensTypeMock);
    });

    test('Should return a Forbidden Exception for the refreshTokens method;', async () => {
      const unauthorizedException: HttpException = new UnauthorizedException('Unauthorized.');
      const validateRefreshTokenMock = jest.spyOn(TokenService.prototype as any, 'validateRefreshToken');
      validateRefreshTokenMock.mockResolvedValue(null);
      errorHandlerMiddleware(unauthorizedException, reqMock, resMock, nextMock);

      await expect(tokenService.refreshTokens(refreshTokenMock)).rejects.toThrow(Error);
      expect(resMock.status).toBeCalledWith(HttpStatusCode.UNAUTHORIZED);
      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.json).toBeCalledWith({ error: 'Unauthorized.', status: HttpStatusCode.UNAUTHORIZED });
      expect(resMock.json).toBeCalledTimes(1);
      expect(nextMock).not.toHaveBeenCalled();
    });
  });

  describe('deleteRefreshToken', () => {
    test('Should return boolean;', async () => {
      const encryptRefreshTokenMock = jest.fn().toString();
      const decryptTokenMock = jest.fn().toString();
      const decryptRefreshTokenMock = jest.spyOn(TokenService.prototype as any, 'decryptRefreshToken');
      decryptRefreshTokenMock.mockReturnValueOnce(jest.fn().toString());
      tokenRepositoryMock.delete.mockResolvedValue(true);
      const result = await tokenService.deleteRefreshToken(encryptRefreshTokenMock);

      expect(decryptRefreshTokenMock).toBeCalledWith(encryptRefreshTokenMock);
      expect(decryptRefreshTokenMock).toBeCalledTimes(1);
      expect(tokenRepositoryMock.delete).toBeCalledWith({ refresh_token: decryptTokenMock });
      expect(tokenRepositoryMock.delete).toBeCalledTimes(1);
      expect(result).toStrictEqual(true);
    });

    test('Should return a Forbidden Exception for the deleteRefreshToken method;', async () => {
      const forbiddenException: HttpException = new ForbiddenException('deleteRefreshToken Error.');
      tokenRepositoryMock.delete.mockRejectedValue(forbiddenException);
      errorHandlerMiddleware(forbiddenException, reqMock, resMock, nextMock);

      await expect(tokenRepositoryMock.delete).rejects.toThrow(Error);
      expect(resMock.status).toBeCalledWith(HttpStatusCode.FORBIDDEN);
      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.json).toBeCalledWith({ error: 'deleteRefreshToken Error.', status: HttpStatusCode.FORBIDDEN });
      expect(resMock.json).toBeCalledTimes(1);
      expect(nextMock).not.toHaveBeenCalled();
    });
  });
});
