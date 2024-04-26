import { Test, TestingModule } from '@nestjs/testing';
import { TossService } from './toss.service';

describe('TossService', () => {
  let service: TossService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TossService],
    }).compile();

    service = module.get<TossService>(TossService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
