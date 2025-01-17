import { Module } from '@nestjs/common';
import { StoryRequestGateway as WebSocketStoryGateway } from './ws-story.gateway';
import { StoryModule } from '@/app/modules/story/story.module';

@Module({
  imports: [StoryModule],
  providers: [WebSocketStoryGateway],
  exports: [WebSocketStoryGateway],
})
export class WebSocketStoryModule {}
