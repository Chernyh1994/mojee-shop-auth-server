import { Knex } from 'knex';

/**
 * Knex.js ORM configuration.
 */
export const databaseConfig: Knex.Config = {
  /**
   * Database client, pg(PostgreSQL) by default;
   */
  client: 'pg',

  /**
   * Connection options;
   */
  connection: {
    /**
     * Database host, localhost by default;
     */
    host: process.env.DATABASE_HOST || 'localhost',

    /**
     * Database port, 5432 port by default;
     */
    port: parseInt(process.env.DATABASE_PORT) || 5432,

    /**
     * Database username;
     */
    user: process.env.DATABASE_USERNAME,

    /**
     * Database passport;
     */
    password: process.env.DATABASE_PASSWORD,

    /**
     * Database name;
     */
    database: process.env.DATABASE_NAME,
  },

  /**
   * Knex.js debugger;
   */
  debug: process.env?.NODE_ENV === 'development',

  /**
   * A connection pool, min: 2, max: 10 by default;
   */
  pool: { min: 0, max: 10 },
};
