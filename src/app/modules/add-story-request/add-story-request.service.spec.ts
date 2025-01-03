import { Test, TestingModule } from '@nestjs/testing';
import { AddStoryRequestService } from './add-story-request.service';

describe('AddStoryRequestService', () => {
  let service: AddStoryRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddStoryRequestService],
    }).compile();

    service = module.get<AddStoryRequestService>(AddStoryRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
