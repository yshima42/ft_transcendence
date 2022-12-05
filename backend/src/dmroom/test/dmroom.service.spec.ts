import { Test, TestingModule } from '@nestjs/testing';
import { DmroomService } from '../dmroom.service';

describe('DmroomService', () => {
  let service: DmroomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DmroomService],
    }).compile();

    service = module.get<DmroomService>(DmroomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
