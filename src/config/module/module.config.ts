import { join } from 'path';
import { SwaggerConfig } from '../interfaces/swagger-config.interface';
import { ServeStaticModule } from '@nestjs/serve-static';

export const serveStaticModule = async (swaggerConfig: SwaggerConfig) => {
  ServeStaticModule.forRootAsync({
    useFactory: (swaggerConfig: SwaggerConfig) => [
      {
        rootPath: join(__dirname, '../..', 'wwwroot'),
        serveRoot: `/${swaggerConfig.swaggerUrl}/wwwroot`,
      },
    ],
  });
};
