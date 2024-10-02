import { Test, TestingModule } from '@nestjs/testing';
import { AddStoryRequestController } from './add-story-request.controller';

describe('AddStoryRequestController', () => {
  let controller: AddStoryRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddStoryRequestController],
    }).compile();

    controller = module.get<AddStoryRequestController>(AddStoryRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
