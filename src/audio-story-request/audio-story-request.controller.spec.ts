import { Test, TestingModule } from '@nestjs/testing';
import { AudioStoryRequestController } from './audio-story-request.controller';

describe('RequestAudioStoryController', () => {
  let controller: AudioStoryRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AudioStoryRequestController],
    }).compile();

    controller = module.get<AudioStoryRequestController>(
      AudioStoryRequestController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
