import { Test, TestingModule } from '@nestjs/testing';
import { MangementService } from './mangement.service';

describe('MangementService', () => {
  let service: MangementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MangementService],
    }).compile();

    service = module.get<MangementService>(MangementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
