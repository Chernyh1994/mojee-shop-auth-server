import { Knex } from 'knex';
import BaseRepository from './base.repository';
import { TokenEntity } from '../entity/token.entity';

/**
 * TokenRepository class.
 */
export default class TokenRepository extends BaseRepository<TokenEntity> {
  /**
   * @constructor
   */
  constructor(private database: Knex) {
    super(database, 'tokens');
  }
}
