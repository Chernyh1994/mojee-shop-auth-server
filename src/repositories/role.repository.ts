import { Knex } from 'knex';
import BaseRepository from './base.repository';
import { RoleEntity } from '../entity/role.entity';

export default class RoleRepository extends BaseRepository<RoleEntity> {
  constructor(private database: Knex) {
    super(database, 'roles');
  }
}
