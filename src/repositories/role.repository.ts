import { Knex } from 'knex';
import BaseRepository from './base.repository';
import { RoleEntity } from '../entity/role.entity';

/**
 * RoleRepository class.
 */
export default class RoleRepository extends BaseRepository<RoleEntity> {
  /**
   * @constructor
   */
  constructor(private database: Knex) {
    super(database, 'roles');
  }
}
