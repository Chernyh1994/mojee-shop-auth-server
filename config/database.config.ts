import { Knex } from 'knex';

export const databaseConfig: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
  debug: process.env?.NODE_ENV === 'development',
  pool: { min: 0, max: 10 },
};
