import { ChatRoomStatus } from '@prisma/client';
import * as CV from 'class-validator';

export class UpdateChatRoomDto {
  @CV.IsNotEmpty()
  @CV.IsEnum(ChatRoomStatus)
  roomStatus!: ChatRoomStatus;

  @CV.IsString()
  @CV.IsOptional()
  @CV.MaxLength(128)
  password?: string;
}
