import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { SocketIOAdapter } from './shared/ws-story/socket-io-adapter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/interfaces/app-environment.interface';
import { SwaggerConfig } from './config/interfaces/swagger-config.interface';
import SwaggerDocumentBuilder from './swagger/swagger-document-builder';
import { join } from 'path';
import validationExceptionFactory from './common/filters/validation-exception-factory';
import { HttpErrorFilter } from './common/filters/http-error.filter';
import { PrismaErrorFilter } from './common/filters/prisma-error.filter';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  const appConfig: AppConfig = configService.get('app');

  const port: number = appConfig.port;
  const globalPrefix: string = appConfig.globalPrefix;

  const logger = new Logger('NestApplication');

  const options = {
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    skipMissingProperties: false,
  };

  const corsOptions = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  };

  app.useGlobalPipes(
    new ValidationPipe({
      ...options,
      exceptionFactory: validationExceptionFactory,
    }),
  );

  app.useGlobalFilters(new HttpErrorFilter(), new PrismaErrorFilter());

  app.useStaticAssets(join(__dirname, '..', 'wwwroot/swagger/assets'));

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(corsOptions);
  app.setGlobalPrefix(globalPrefix);

  app.useWebSocketAdapter(new SocketIOAdapter(app));
  app.useGlobalInterceptors(new LoggerInterceptor());

  const swaggerConfig: SwaggerConfig = configService.get('swagger');

  const swaggerDocumentBuilder = new SwaggerDocumentBuilder(app, swaggerConfig);

  swaggerDocumentBuilder.setupSwagger();

  await app.listen(port, () => {
    logger.log(`Server initialized on port ${port}`);
  });
}
bootstrap();
