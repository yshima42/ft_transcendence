import { ChatUserStatus } from '@prisma/client';
import * as CV from 'class-validator';

type limit = '1m' | '1h' | '1d' | '1w' | '1M' | 'unlimited';

export class UpdateChatRoomUserDto {
  @CV.IsNotEmpty()
  @CV.IsEnum(ChatUserStatus)
  status!: ChatUserStatus;

  @CV.IsOptional()
  @CV.IsString()
  @CV.IsIn(['1m', '1h', '1d', '1w', '1M', 'unlimited'])
  limit?: limit;
}
