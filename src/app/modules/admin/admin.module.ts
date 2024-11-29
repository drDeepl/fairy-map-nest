import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { MapModule } from '../map/map.module';
import { StoryModule } from '../story/story.module';
import { MulterImageConfigService } from '@/shared/multer/multer-image-config.service';
import { MulterModule } from '@nestjs/platform-express';
import { multerImgFactory } from './factories/multer-img.factory';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StoryService } from '../story/services/story.service';

@Module({
  imports: [
    MapModule,
    StoryModule,
    MulterModule.registerAsync({
      imports: [ConfigModule, StoryModule],
      useFactory: multerImgFactory,
      inject: [ConfigService, StoryService],
    }),
  ],

  controllers: [AdminController],
})
export class AdminModule {}
