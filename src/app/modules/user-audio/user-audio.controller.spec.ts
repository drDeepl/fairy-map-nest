import { Test, TestingModule } from '@nestjs/testing';
import { UserAudioController } from './user-audio.controller';

describe('UserAudioController', () => {
  let controller: UserAudioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAudioController],
    }).compile();

    controller = module.get<UserAudioController>(UserAudioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
