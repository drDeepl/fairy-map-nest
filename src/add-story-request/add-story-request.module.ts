import { Module } from '@nestjs/common';
import { AddStoryRequestController } from './add-story-request.controller';
import { AddStoryRequestRepository } from './add-story-request.repository';
import { AddStoryRequestService } from './add-story-request.service';

@Module({
  controllers: [AddStoryRequestController],
  providers: [AddStoryRequestRepository, AddStoryRequestService],
})
export class AddStoryRequestModule {}
