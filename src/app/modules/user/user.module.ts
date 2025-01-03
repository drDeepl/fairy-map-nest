import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { UserAudioModule } from '../user-audio/user-audio.module';
import { AudioStoryRequestModule } from '../audio-story-request/audio-story-request.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { multerFactory } from '@/common/factories/multer.factory';
import { StoryService } from '../story/services/story.service';
import { StoryModule } from '../story/story.module';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule, StoryModule],
      useFactory: multerFactory,
      inject: [ConfigService, StoryService],
    }),
    UserAudioModule,
    AudioStoryRequestModule,
  ],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserService],
})
export class UserModule {}
