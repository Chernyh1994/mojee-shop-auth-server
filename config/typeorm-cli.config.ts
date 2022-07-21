import 'dotenv/config';
import { DataSource } from 'typeorm';
import { databaseConfig } from './database.config';

const dataSource: DataSource = new DataSource(databaseConfig);

export default dataSource;
