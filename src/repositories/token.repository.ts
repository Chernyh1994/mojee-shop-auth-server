import { Knex } from 'knex';
import BaseRepository from './base.repository';
import { TokenEntity } from '../entity/token.entity';

export default class TokenRepository extends BaseRepository<TokenEntity> {
  constructor(private database: Knex) {
    super(database, 'tokens');
  }
}
