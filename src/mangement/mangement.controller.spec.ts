import { Test, TestingModule } from '@nestjs/testing';
import { MangementController } from './mangement.controller';
import { MangementService } from './mangement.service';

describe('MangementController', () => {
  let controller: MangementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MangementController],
      providers: [MangementService],
    }).compile();

    controller = module.get<MangementController>(MangementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
