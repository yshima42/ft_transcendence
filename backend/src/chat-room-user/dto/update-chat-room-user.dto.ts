import { ChatUserStatus } from '@prisma/client';
import * as CV from 'class-validator';

export class UpdateChatRoomUserDto {
  @CV.IsNotEmpty()
  @CV.IsEnum(ChatUserStatus)
  status!: ChatUserStatus;
}
