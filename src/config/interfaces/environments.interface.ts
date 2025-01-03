import { JwtConfig } from './jwt-config.interface';
import { PrismaConfig } from './prisma-config.interface';
import { SwaggerConfig } from './swagger-config.interface';

export interface EnvironmentVariables {
  isDevelop: boolean;
  port: number;
  jwt: JwtConfig;
  globalPrefix: string;
  swagger: SwaggerConfig;
  postgre: PrismaConfig;
}
