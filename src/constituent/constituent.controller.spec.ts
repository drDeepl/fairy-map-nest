import { Test, TestingModule } from '@nestjs/testing';
import { ConstituentsController } from './constituents.controller';

describe('ConstituentsController', () => {
  let controller: ConstituentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConstituentsController],
    }).compile();

    controller = module.get<ConstituentsController>(ConstituentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
