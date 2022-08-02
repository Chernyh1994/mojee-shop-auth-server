import { Knex } from 'knex';
import BaseRepository from './base.repository';
import { UserEntity } from '../entity/user.entity';

/**
 * UserRepository class.
 */
export default class UserRepository extends BaseRepository<UserEntity> {
  /**
   * @constructor
   */
  constructor(private database: Knex) {
    super(database, 'users');
  }
}
