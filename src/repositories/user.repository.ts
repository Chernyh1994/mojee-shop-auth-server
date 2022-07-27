import { Knex } from 'knex';
import BaseRepository from './base.repository';
import { UserEntity } from '../entity/user.entity';

export default class UserRepository extends BaseRepository<UserEntity> {
  constructor(private database: Knex) {
    super(database, 'users');
  }
}
