import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  isDevelop: Boolean(process.env.IS_DEVELOP),
  port: parseInt(process.env.PORT),
  globalPrefix: process.env.GLOBAL_PREFIX_APP,
}));
