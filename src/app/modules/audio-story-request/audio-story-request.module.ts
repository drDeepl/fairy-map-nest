import { Module } from '@nestjs/common';
import { AudioStoryRequestController } from './controllers/audio-story-request.controller';
import { AudioStoryRequestService } from './services/audio-story-request.service';

import { WebSocketStoryModule } from '@/shared/ws-story/ws-story.module';

@Module({
  imports: [WebSocketStoryModule],
  controllers: [AudioStoryRequestController],
  providers: [AudioStoryRequestService],
  exports: [AudioStoryRequestService],
})
export class AudioStoryRequestModule {}
