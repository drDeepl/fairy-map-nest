import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { SocketIOAdapter } from './shared/ws-story-request/socket-io-adapter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/interfaces/app-environment.interface';
import { SwaggerConfig } from './config/interfaces/swagger-config.interface';
import SwaggerDocumentBuilder from './swagger/swagger-document-builder';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  const appConfig: AppConfig = configService.get('app');

  const port: number = appConfig.port;
  const globalPrefix: string = appConfig.globalPrefix;

  const logger = new Logger('NestApplication');

  app.useStaticAssets(join(__dirname, '..', 'wwwroot/swagger/assets'));

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.setGlobalPrefix(globalPrefix);
  app.useWebSocketAdapter(new SocketIOAdapter(app));

  const swaggerConfig: SwaggerConfig = configService.get('swagger');

  const swaggerDocumentBuilder = new SwaggerDocumentBuilder(app, swaggerConfig);
  swaggerDocumentBuilder.setupSwagger();

  await app.listen(port, () => {
    logger.log(`Server initialized on port ${port}`);
  });
}
bootstrap();
