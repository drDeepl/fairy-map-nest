import { Module } from '@nestjs/common';
import { StoryRequestGateway } from './ws-story-request.gateway';

@Module({
  providers: [StoryRequestGateway],
})
export class WsStoryRequestModule {}
