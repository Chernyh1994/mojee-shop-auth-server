import RepositoryInterface from './contracts/repository.interface';
import { Knex } from 'knex';
import { User } from '../entity/user.entity';

export default class UserRepository implements RepositoryInterface<User> {
  constructor(private db: Knex) {}

  public async findAll(): Promise<User[]> {
    return this.db<User>('users').select({
      id: 'id',
      email: 'email',
    });
  }
}
