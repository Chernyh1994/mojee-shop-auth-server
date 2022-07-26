import { asClass, asValue, createContainer, InjectionMode } from 'awilix';
import { scopePerRequest } from 'awilix-express';
import { Application } from 'express';
import { Knex } from 'knex';
import db from '../../toolkit/knex.toolkit';
import AuthService from '../services/auth.service';
import UserRepository from '../repositories/user.repository';

interface IContainer {
  authService: AuthService;
  userRepository: UserRepository;
  db: Knex;
}

const Container = createContainer<IContainer>({
  injectionMode: InjectionMode.CLASSIC,
});

export const loadContainer = (app: Application): void => {
  Container.register({
    authService: asClass(AuthService).scoped(),

    userRepository: asClass(UserRepository).scoped(),

    db: asValue(db),
  });

  app.use(scopePerRequest(Container));
};
