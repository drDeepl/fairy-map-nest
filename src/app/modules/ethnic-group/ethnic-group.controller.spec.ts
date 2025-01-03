import { Test, TestingModule } from '@nestjs/testing';
import { EthnicGroupController } from './ethnic-group.controller';

describe('EthnicGroupController', () => {
  let controller: EthnicGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EthnicGroupController],
    }).compile();

    controller = module.get<EthnicGroupController>(EthnicGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
