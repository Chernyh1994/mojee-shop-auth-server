import { asClass, asValue, createContainer, InjectionMode } from 'awilix';
import { scopePerRequest } from 'awilix-express';
import { Application } from 'express';
import { Knex } from 'knex';
import db from '../commons/toolkit/knex.toolkit';
import AuthService from '../services/auth.service';
import UserRepository from '../repositories/user.repository';
import MailService from '../services/mail.service';
import TokenService from '../services/token.service';
import UserService from '../services/user.service';
import RoleService from '../services/role.service';
import CryptoService from '../services/crypto.service';
import TokenRepository from '../repositories/token.repository';
import RoleRepository from '../repositories/role.repository';

interface IContainer {
  authService: AuthService;
  mailService: MailService;
  roleService: RoleService;
  tokenService: TokenService;
  userService: UserService;
  cryptoService: CryptoService;

  userRepository: UserRepository;
  tokenRepository: TokenRepository;
  roleRepository: RoleRepository;

  database: Knex;
}

const Container = createContainer<IContainer>({
  injectionMode: InjectionMode.CLASSIC,
});

export const containerSetup = (app: Application): void => {
  Container.register({
    authService: asClass(AuthService).scoped(),
    mailService: asClass(MailService).scoped(),
    roleService: asClass(RoleService).scoped(),
    tokenService: asClass(TokenService).scoped(),
    userService: asClass(UserService).scoped(),
    cryptoService: asClass(CryptoService).scoped(),

    userRepository: asClass(UserRepository).scoped(),
    tokenRepository: asClass(TokenRepository).scoped(),
    roleRepository: asClass(RoleRepository).scoped(),

    database: asValue(db),
  });

  app.use(scopePerRequest(Container));
};
