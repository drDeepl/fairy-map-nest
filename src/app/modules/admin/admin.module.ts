import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { MapModule } from '../map/map.module';
import { StoryModule } from '../story/story.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerFactory } from '../../../common/factories/multer.factory';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StoryService } from '../story/services/story.service';
import { UserAudioModule } from '../user-audio/user-audio.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MapModule,
    StoryModule,
    UserAudioModule,
    UserModule,
    MulterModule.registerAsync({
      imports: [ConfigModule, StoryModule],
      useFactory: multerFactory,
      inject: [ConfigService, StoryService],
    }),
  ],

  controllers: [AdminController],
})
export class AdminModule {}
