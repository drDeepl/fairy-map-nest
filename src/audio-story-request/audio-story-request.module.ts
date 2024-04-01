import { Module } from '@nestjs/common';
import { AudioStoryRequestController } from './audio-story-request.controller';
import { AudioStoryRequestGateway } from './audio-story-request.gateway';
import { AudioStoryRequestService } from './audio-story-request.service';

@Module({
  controllers: [AudioStoryRequestController],

  providers: [AudioStoryRequestGateway, AudioStoryRequestService],
})
export class AudioStoryRequestModule {}
