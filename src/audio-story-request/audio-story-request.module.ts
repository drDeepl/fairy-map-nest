import { Module } from '@nestjs/common';
import { AudioStoryRequestController } from './audio-story-request.controller';
// import { AudioStoryRequestGateway } from './audio-story-request.gateway';
import { AudioStoryRequestService } from './audio-story-request.service';
import { StoryRequestGateway } from '@/ws-story-request/ws-story-request.gateway';

@Module({
  controllers: [AudioStoryRequestController],

  providers: [StoryRequestGateway, AudioStoryRequestService],
})
export class AudioStoryRequestModule {}
