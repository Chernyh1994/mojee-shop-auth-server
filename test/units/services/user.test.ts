import { NextFunction, Request, Response } from 'express';
import UserService from '../../../src/services/user.service';
import { UserEntity } from '../../../src/entity/user.entity';
import HttpException from '../../../src/commons/exceptions/http/http.exception';
import ForbiddenException from '../../../src/commons/exceptions/http/forbidden.exception';
import errorHandlerMiddleware from '../../../src/middlewares/error-handler.middleware';
import { HttpStatusCode } from '../../../src/commons/enums/http-startus-code.enum';
import UserRepository from '../../../src/repositories/user.repository';
import RoleService from '../../../src/services/role.service';
import { CreateUserDto } from '../../../src/commons/dto/services/user/create-user.dto';
import { RoleEntity } from '../../../src/entity/role.entity';
import { UserRoleValue } from '../../../src/commons/enums/user-role.enum';

describe('UserService', () => {
  let userService: UserService;
  let resMock: Response;
  let reqMock: Request;
  let nextMock: NextFunction;
  let userEntityMock: UserEntity;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const userRepositoryMock: jest.Mocked<UserRepository> = {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const roleServiceMock: jest.Mocked<RoleService> = {
    findOneByNameOrCreate: jest.fn(),
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

    userEntityMock = jest.fn() as unknown as UserEntity;

    userService = new UserService(userRepositoryMock, roleServiceMock);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createUser', () => {
    const createUserMock: CreateUserDto = {
      email: jest.fn().toString(),
      password: jest.fn().toString(),
    } as unknown as CreateUserDto;

    test('Should return User Entity;', async () => {
      const RoleEntityMock: RoleEntity = jest.fn() as unknown as RoleEntity;
      userRepositoryMock.findOne.mockResolvedValue(null);
      roleServiceMock.findOneByNameOrCreate.mockResolvedValue(RoleEntityMock);
      const hashPasswordMock = jest.spyOn(UserService.prototype as any, 'hashPassword');
      hashPasswordMock.mockImplementation(() => jest.fn().toString());
      userRepositoryMock.create.mockResolvedValue(userEntityMock);
      const result = await userService.createUser(createUserMock);

      expect(userRepositoryMock.findOne).toBeCalledWith({ email: createUserMock.email });
      expect(userRepositoryMock.findOne).toBeCalledTimes(1);
      expect(roleServiceMock.findOneByNameOrCreate).toBeCalledWith(UserRoleValue.USER);
      expect(roleServiceMock.findOneByNameOrCreate).toBeCalledTimes(1);
      expect(hashPasswordMock).toBeCalledWith(createUserMock.password);
      expect(hashPasswordMock).toBeCalledTimes(1);
      expect(userRepositoryMock.create).toBeCalledWith(createUserMock);
      expect(userRepositoryMock.create).toBeCalledTimes(1);
      expect(result).toBe(userEntityMock);
    });

    test('Should return a Forbidden Exception for the createUser method;', async () => {
      const forbiddenException: HttpException = new ForbiddenException('Email is not available.');
      userRepositoryMock.findOne.mockResolvedValue(userEntityMock);
      errorHandlerMiddleware(forbiddenException, reqMock, resMock, nextMock);

      await expect(userService.createUser(createUserMock)).rejects.toThrow(Error);
      expect(resMock.status).toBeCalledWith(HttpStatusCode.FORBIDDEN);
      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.json).toBeCalledWith({ error: 'Email is not available.', status: HttpStatusCode.FORBIDDEN });
      expect(resMock.json).toBeCalledTimes(1);
      expect(nextMock).not.toHaveBeenCalled();
    });
  });

  describe('findUserByEmail', () => {
    test('Should return User Entity;', async () => {
      const emailMock: string = jest.fn().toString();
      userRepositoryMock.findOne.mockResolvedValue(userEntityMock);
      const result = await userService.findUserByEmail(emailMock);

      expect(userRepositoryMock.findOne).toBeCalledWith({ email: emailMock });
      expect(userRepositoryMock.findOne).toBeCalledTimes(1);
      expect(result).toBe(userEntityMock);
    });

    test('Should return a Forbidden Exception for the findUserByEmail method;', async () => {
      const forbiddenException: HttpException = new ForbiddenException('Error message.');
      userRepositoryMock.findOne.mockRejectedValue(forbiddenException);
      errorHandlerMiddleware(forbiddenException, reqMock, resMock, nextMock);

      await expect(userRepositoryMock.findOne).rejects.toThrow(Error);
      expect(resMock.status).toBeCalledWith(HttpStatusCode.FORBIDDEN);
      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.json).toBeCalledWith({ error: 'Error message.', status: HttpStatusCode.FORBIDDEN });
      expect(resMock.json).toBeCalledTimes(1);
      expect(nextMock).not.toHaveBeenCalled();
    });
  });

  describe('verifyUser', () => {
    const id = 1;

    test('Should return User Entity;', async () => {
      userRepositoryMock.findOne.mockResolvedValue(userEntityMock);
      userRepositoryMock.update.mockResolvedValue(userEntityMock);
      const result = await userService.verifyUser(id);

      expect(userRepositoryMock.findOne).toBeCalledWith({ id });
      expect(userRepositoryMock.findOne).toBeCalledTimes(1);
      expect(userRepositoryMock.update).toBeCalledWith(id, { is_verified: true });
      expect(userRepositoryMock.update).toBeCalledTimes(1);
      expect(result).toBe(userEntityMock);
    });

    test('Should return a Forbidden Exception for the verifyUser method;', async () => {
      const forbiddenException: HttpException = new ForbiddenException('User not found.');
      userRepositoryMock.findOne.mockResolvedValue(null);
      errorHandlerMiddleware(forbiddenException, reqMock, resMock, nextMock);

      await expect(userService.verifyUser(id)).rejects.toThrow(Error);
      expect(resMock.status).toBeCalledWith(HttpStatusCode.FORBIDDEN);
      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.json).toBeCalledWith({ error: 'User not found.', status: HttpStatusCode.FORBIDDEN });
      expect(resMock.json).toBeCalledTimes(1);
      expect(nextMock).not.toHaveBeenCalled();
    });
  });

  describe('changePassword', () => {
    const id = 1;
    const password: string = jest.fn().toString();

    test('Should return User Entity;', async () => {
      userRepositoryMock.findOne.mockResolvedValue(userEntityMock);
      const hashPasswordMock = jest.spyOn(UserService.prototype as any, 'hashPassword');
      hashPasswordMock.mockImplementation(() => password);
      userRepositoryMock.update.mockResolvedValue(userEntityMock);
      const result = await userService.changePassword(id, password);

      expect(userRepositoryMock.findOne).toBeCalledWith({ id });
      expect(userRepositoryMock.findOne).toBeCalledTimes(1);
      expect(hashPasswordMock).toBeCalledWith(password);
      expect(hashPasswordMock).toBeCalledTimes(1);
      expect(userRepositoryMock.update).toBeCalledWith(id, { password });
      expect(userRepositoryMock.update).toBeCalledTimes(1);
      expect(result).toBe(userEntityMock);
    });

    test('Should return a Forbidden Exception for the changePassword method;', async () => {
      const forbiddenException: HttpException = new ForbiddenException('User not found.');
      userRepositoryMock.findOne.mockResolvedValue(null);
      errorHandlerMiddleware(forbiddenException, reqMock, resMock, nextMock);

      await expect(userService.changePassword(id, password)).rejects.toThrow(Error);
      expect(resMock.status).toBeCalledWith(HttpStatusCode.FORBIDDEN);
      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.json).toBeCalledWith({ error: 'User not found.', status: HttpStatusCode.FORBIDDEN });
      expect(resMock.json).toBeCalledTimes(1);
      expect(nextMock).not.toHaveBeenCalled();
    });
  });
});
