import { Test, TestingModule } from '@nestjs/testing';
import { RequestAudioStoryService } from './request-audio-story.service';

describe('RequestAudioStoryService', () => {
  let service: RequestAudioStoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestAudioStoryService],
    }).compile();

    service = module.get<RequestAudioStoryService>(RequestAudioStoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
