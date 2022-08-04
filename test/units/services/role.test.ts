import { NextFunction, Request, Response } from 'express';
import RoleService from '../../../src/services/role.service';
import RoleRepository from '../../../src/repositories/role.repository';
import { RoleEntity } from '../../../src/entity/role.entity';
import { RoleType } from '../../../src/commons/types/role.type';
import HttpException from '../../../src/commons/exceptions/http/http.exception';
import ForbiddenException from '../../../src/commons/exceptions/http/forbidden.exception';
import errorHandlerMiddleware from '../../../src/middlewares/error-handler.middleware';
import { HttpStatusCode } from '../../../src/commons/enums/http-startus-code.enum';

describe('RoleService', () => {
  let roleService: RoleService;
  let resMock: Response;
  let reqMock: Request;
  let nextMock: NextFunction;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const roleRepositoryMock: jest.Mocked<RoleRepository> = {
    findOne: jest.fn(),
    create: jest.fn(),
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
    roleService = new RoleService(roleRepositoryMock);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('findOneByNameOrCreate', () => {
    const roleName: RoleType = jest.fn() as unknown as RoleType;
    const newRole: any = {
      name: roleName,
      description: `Role's ${roleName}`,
    };
    const role: RoleEntity = {
      id: 1,
      name: 'USER',
      description: 'User role',
      created_at: new Date(),
      updated_at: new Date(),
    };

    test('Should return RoleEntity;', async () => {
      roleRepositoryMock.findOne.mockResolvedValue(role);
      const result = await roleService.findOneByNameOrCreate(roleName);

      expect(roleRepositoryMock.findOne).toBeCalledWith({ name: roleName });
      expect(roleRepositoryMock.findOne).toBeCalledTimes(1);
      expect(result).toBe(role);
    });

    test('Should create RoleEntity and return;', async () => {
      roleRepositoryMock.findOne.mockResolvedValue(null);
      roleRepositoryMock.create.mockResolvedValue(role);
      const result = await roleService.findOneByNameOrCreate(roleName);

      expect(roleRepositoryMock.findOne).toBeCalledWith({ name: roleName });
      expect(roleRepositoryMock.findOne).toBeCalledTimes(1);
      expect(roleRepositoryMock.create).toBeCalledWith(newRole);
      expect(roleRepositoryMock.create).toBeCalledTimes(1);
      expect(result).toBe(role);
    });

    test('Should return a Forbidden Exception for the registration method;', async () => {
      const forbiddenException: HttpException = new ForbiddenException('Error message.');
      roleRepositoryMock.findOne.mockRejectedValue(forbiddenException);
      errorHandlerMiddleware(forbiddenException, reqMock, resMock, nextMock);

      await expect(roleRepositoryMock.findOne).rejects.toThrow(Error);
      expect(resMock.status).toBeCalledWith(HttpStatusCode.FORBIDDEN);
      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.json).toBeCalledWith({ error: 'Error message.', status: 403 });
      expect(resMock.json).toBeCalledTimes(1);
      expect(nextMock).not.toHaveBeenCalled();
    });
  });
});
