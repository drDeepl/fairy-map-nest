import { Module } from '@nestjs/common';
import { AudioStoryRequestController } from './audio-story-request.controller';
import { AudioStoryRequestService } from './audio-story-request.service';

@Module({
  controllers: [AudioStoryRequestController],
  providers: [AudioStoryRequestService],
})
export class AudioStoryRequestModule {}
