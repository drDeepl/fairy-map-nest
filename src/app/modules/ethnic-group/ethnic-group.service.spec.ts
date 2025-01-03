import { Test, TestingModule } from '@nestjs/testing';
import { EthnicGroupService } from './ethnic-group.service';

describe('EthnicGroupService', () => {
  let service: EthnicGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EthnicGroupService],
    }).compile();

    service = module.get<EthnicGroupService>(EthnicGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
