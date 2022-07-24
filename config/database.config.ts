import { DataSourceOptions } from 'typeorm';

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  logging: true,
  synchronize: process.env?.NODE_ENV === 'development',
  entities: ['dist/src/entity/**.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/**{.ts,.js}'],
};
