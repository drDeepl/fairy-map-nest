import appConfig from '@/config/app.config';
import swaggerConfig from '@/config/swagger.config';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AudioStoryRequestModule } from '../audio-story-request/audio-story-request.module';
import { AuthModule } from '../auth/auth.module';
import { ConstituentsModule } from '../constituent/constituent.module';
import { EthnicGroupModule } from '../ethnic-group/ethnic-group.module';
import { MapModule } from '../map/map.module';
import { PrismaModule } from '../prisma/prisma.module';
import { RequestModule } from '../request/request.module';
import { StoryModule } from '../story/story.module';
import { UserAudioModule } from '../user-audio/user-audio.module';

import { WsStoryRequestModule } from '../ws-story-request/ws-story-request.module';
import { AddStoryRequestModule } from './add-story-request/add-story-request.module';
import { environmentsVariablesValidationSchema } from '@/config/validation/schemas/environment-validation.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: environmentsVariablesValidationSchema,
      load: [appConfig, swaggerConfig],
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    ConstituentsModule,
    EthnicGroupModule,
    MapModule,
    StoryModule,
    UserAudioModule,
    AudioStoryRequestModule,
    RequestModule,
    AddStoryRequestModule,
    WsStoryRequestModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
