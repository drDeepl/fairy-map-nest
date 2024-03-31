import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AudioStoryRequestModule } from './audio-story-request/audio-story-request.module';
import { AuthModule } from './auth/auth.module';
import { ConstituentsModule } from './constituent/constituent.module';
import { EthnicGroupModule } from './ethnic-group/ethnic-group.module';
import { MapModule } from './map/map.module';
import { PrismaModule } from './prisma/prisma.module';
import { RequestModule } from './request/request.module';
import { StoryModule } from './story/story.module';
import { UserAudioModule } from './user-audio/user-audio.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`],
      cache: true,
    }),
    PrismaModule,
    UserModule,
    ConstituentsModule,
    EthnicGroupModule,
    MapModule,
    StoryModule,
    UserAudioModule,
    AudioStoryRequestModule,
    RequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
