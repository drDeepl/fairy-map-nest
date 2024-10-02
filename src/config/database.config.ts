import { registerAs } from '@nestjs/config';

export default registerAs('postgre', () => ({
  host: process.env.POSTGRE_HOST,
  port: parseInt(process.env.POSTGRE_PORT),
  user: process.env.POSTGRE_USER,
  password: process.env.POSTGRE_PASSWORD,
  database: process.env.POSTGRE_DATABASE,
  poolSize: parseInt(process.env.POSTGRE_POOL_SIZE),
}));
