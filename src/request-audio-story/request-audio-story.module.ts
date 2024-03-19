import { Module } from '@nestjs/common';
import { RequestAudioStoryController } from './request-audio-story.controller';
import { RequestAudioStoryService } from './request-audio-story.service';

@Module({
  controllers: [RequestAudioStoryController],
  providers: [RequestAudioStoryService]
})
export class RequestAudioStoryModule {}
