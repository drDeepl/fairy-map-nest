import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { MapModule } from '../map/map.module';
import { StoryModule } from '../story/story.module';

@Module({
  imports: [MapModule, StoryModule],
  controllers: [AdminController],
})
export class AdminModule {}
