import { ChatRoomMemberStatus } from '@prisma/client';
import * as CV from 'class-validator';
import { LimitTime } from 'src/chat-room-member/chat-room-member.interface';

export class UpdateChatRoomMemberDto {
  @CV.IsNotEmpty()
  @CV.IsEnum(ChatRoomMemberStatus)
  memberStatus!: ChatRoomMemberStatus;

  @CV.IsOptional()
  @CV.IsString()
  @CV.IsIn(['1m', '1h', '1d', '1w', '1M', 'unlimited'])
  limit?: LimitTime;
}
