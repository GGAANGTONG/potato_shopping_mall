import { Test, TestingModule } from '@nestjs/testing';
import { TossController } from './toss.controller';
import { TossService } from './toss.service';

describe('TossController', () => {
  let controller: TossController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TossController],
      providers: [TossService],
    }).compile();

    controller = module.get<TossController>(TossController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
