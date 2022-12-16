import { ChatRoomStatus } from '@prisma/client';
import * as CV from 'class-validator';

export class CreateChatRoomDto {
  @CV.IsNotEmpty()
  @CV.IsString()
  name!: string;

  @CV.IsString()
  @CV.IsOptional()
  password?: string;

  @CV.IsOptional()
  @CV.IsEnum(ChatRoomStatus)
  roomStatus?: ChatRoomStatus;
}
