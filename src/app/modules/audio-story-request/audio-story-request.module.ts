import { Module } from '@nestjs/common';
import { AudioStoryRequestController } from './controllers/audio-story-request.controller';
import { AudioStoryRequestService } from './services/audio-story-request.service';
import { StoryRequestGateway } from '@/shared/ws-story-request/ws-story-request.gateway';

@Module({
  controllers: [AudioStoryRequestController],
  providers: [StoryRequestGateway, AudioStoryRequestService],
  exports: [StoryRequestGateway, AudioStoryRequestService],
})
export class AudioStoryRequestModule {}
