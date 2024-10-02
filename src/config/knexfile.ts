import * as dotenv from 'dotenv';
import * as path from 'path';

const path_env: string = path
  .resolve('.env')
  .toString()
  .replace('src\\config\\', '');

dotenv.config({ path: path_env });

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.POSTGRE_HOST,
      port: parseInt(process.env.POSTGRE_PORT),
      user: process.env.POSTGRE_USER,
      password: process.env.POSTGRE_PASSWORD,
      database: process.env.POSTGRE_DATABASE,
      ssl: { rejectUnauthorized: false },
      timezone: process.env.POSTGRE_TZ,
    },
    migrations: {
      extension: 'ts',
      tableName: 'migrations',
      directory: path.join(__dirname, '../database/objection/migrations'),
      stub: path.join(
        __dirname,
        '../database/objection/migrations',
        'migration.stub',
      ),
      loadExtensions: ['.ts'],
    },
    seeds: {
      directory: path.join(__dirname, '../database/objection/seeds'),
      loadExtensions: ['.ts'],
      stub: path.join(__dirname, '../database/objection/seeds/seed.stub'),
    },
    pool: {
      min: 1,
      max: parseInt(process.env.POSTGRE_POOL_SIZE),
    },
  },
}[process.env.NODE_ENV || 'development'];
