import { Test, TestingModule } from '@nestjs/testing';
import { DmroomController } from '../dmroom.controller';
import { DmroomService } from '../dmroom.service';

describe('DmroomController', () => {
  let controller: DmroomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DmroomController],
      providers: [DmroomService],
    }).compile();

    controller = module.get<DmroomController>(DmroomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
