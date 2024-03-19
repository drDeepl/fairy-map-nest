import { Test, TestingModule } from '@nestjs/testing';
import { RequestAudioStoryController } from './request-audio-story.controller';

describe('RequestAudioStoryController', () => {
  let controller: RequestAudioStoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestAudioStoryController],
    }).compile();

    controller = module.get<RequestAudioStoryController>(RequestAudioStoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
