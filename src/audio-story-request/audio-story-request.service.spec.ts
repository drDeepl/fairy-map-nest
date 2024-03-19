import { Test, TestingModule } from '@nestjs/testing';
import { AudioStoryRequestService } from './audio-story-request.service';

describe('RequestAudioStoryService', () => {
  let service: AudioStoryRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AudioStoryRequestService],
    }).compile();

    service = module.get<AudioStoryRequestService>(AudioStoryRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
