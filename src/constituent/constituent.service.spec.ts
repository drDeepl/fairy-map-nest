import { Test, TestingModule } from '@nestjs/testing';
import { ConstituentsService } from './constituents.service';

describe('ConstituentsService', () => {
  let service: ConstituentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConstituentsService],
    }).compile();

    service = module.get<ConstituentsService>(ConstituentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
