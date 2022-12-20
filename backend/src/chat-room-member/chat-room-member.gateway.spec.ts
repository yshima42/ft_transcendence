import { Test, TestingModule } from '@nestjs/testing';
import { ChatRoomMemberGateway } from './chat-room-member.gateway';

describe('ChatRoomMemberGateway', () => {
  let gateway: ChatRoomMemberGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatRoomMemberGateway],
    }).compile();

    gateway = module.get<ChatRoomMemberGateway>(ChatRoomMemberGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
