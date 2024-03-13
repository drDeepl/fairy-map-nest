import { Test, TestingModule } from '@nestjs/testing';
import { UserAudioService } from './user-audio.service';

describe('UserAudioService', () => {
  let service: UserAudioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAudioService],
    }).compile();

    service = module.get<UserAudioService>(UserAudioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
