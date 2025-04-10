import appConfig from '../config/app.config';
import swaggerConfig from '../config/swagger.config';
import prismaConfig from '../config/prisma.config';
import jwtConfig from '../config/jwt.config';
import imgConfig from '../config/uploads.config';
import { UserModule } from '@/app/modules/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AudioStoryRequestModule } from './modules/audio-story-request/audio-story-request.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConstituentsModule } from './modules/constituent/constituent.module';
import { EthnicGroupModule } from './modules/ethnic-group/ethnic-group.module';
import { MapModule } from './modules/map/map.module';
import { PrismaModule } from '../prisma/prisma.module';
import { RequestModule } from './modules/request/request.module';
import { StoryModule } from './modules/story/story.module';
import { UserAudioModule } from './modules/user-audio/user-audio.module';
import { WebSocketStoryModule } from '../shared/ws-story/ws-story.module';
import { AddStoryRequestModule } from './modules/add-story-request/add-story-request.module';
import { environmentsVariablesValidationSchema } from '../config/validation/schemas/environment-validation.schema';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: environmentsVariablesValidationSchema,
      load: [appConfig, swaggerConfig, prismaConfig, jwtConfig, imgConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      renderPath: '/static',
    }),
    PrismaModule,
    AuthModule,
    ConstituentsModule,
    EthnicGroupModule,
    MapModule,
    StoryModule,
    UserAudioModule,
    AudioStoryRequestModule,
    RequestModule,
    AddStoryRequestModule,
    UserModule,
    AdminModule,
    WebSocketStoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
