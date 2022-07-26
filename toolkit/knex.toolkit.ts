import knex, { Knex } from 'knex';
import { databaseConfig } from '../config/database.config';

const db: Knex = knex(databaseConfig);

export default db;
