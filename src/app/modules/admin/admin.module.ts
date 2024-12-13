import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { MapModule } from '../map/map.module';
import { StoryModule } from '../story/story.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerFactory } from './factories/multer.factory';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StoryService } from '../story/services/story.service';

@Module({
  imports: [
    MapModule,
    StoryModule,
    MulterModule.registerAsync({
      imports: [ConfigModule, StoryModule],
      useFactory: multerFactory,
      inject: [ConfigService, StoryService],
    }),
  ],

  controllers: [AdminController],
})
export class AdminModule {}
