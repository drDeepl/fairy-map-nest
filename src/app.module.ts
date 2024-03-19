import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConstituentsModule } from './constituent/constituent.module';
import { PrismaModule } from './prisma/prisma.module';
import { EthnicGroupModule } from './ethnic-group/ethnic-group.module';
import { MapModule } from './map/map.module';
import { StoryModule } from './story/story.module';
import { UserAudioModule } from './user-audio/user-audio.module';
import { AudioStoryRequestModule } from './audio-story-request/audio-story-request.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
