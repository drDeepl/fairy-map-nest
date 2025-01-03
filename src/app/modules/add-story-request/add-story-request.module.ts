import { Module } from '@nestjs/common';
import { AddStoryRequestController } from './add-story-request.controller';
import { AddStoryRequestRepository } from './add-story-request.repository';
import { AddStoryRequestService } from './add-story-request.service';
import { AddStoryRequestGateway } from './add-story-request.gateway';
import { StoryRequestGateway } from '@/shared/ws-story-request/ws-story-request.gateway';

@Module({
  controllers: [AddStoryRequestController],
  providers: [
    StoryRequestGateway,
    AddStoryRequestService,
    AddStoryRequestRepository,
  ],
})
export class AddStoryRequestModule {}
