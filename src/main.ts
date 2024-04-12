import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SocketIOAdapter } from './ws-story-request/socket-io-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setDescription('API интерактивной карты сказок различных национальностей')
    .addTag('InteractiveMap')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  app.useWebSocketAdapter(new SocketIOAdapter(app));

  await app.listen(3005);
}
bootstrap();
