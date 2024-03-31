import { Module } from '@nestjs/common';
import { AudioStoryRequestController } from './audio-story-request.controller';
import { AudioStoryRequestGateway } from './audio-story-request.gateway';
import { AudioStoryRequestService } from './audio-story-request.service';

@Module({
  controllers: [AudioStoryRequestController],
  providers: [AudioStoryRequestService, AudioStoryRequestGateway],
})
export class AudioStoryRequestModule {}
