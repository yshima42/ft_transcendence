import { ChatRoomStatus } from '@prisma/client';
import * as CV from 'class-validator';

export class CreateChatRoomDto {
  @CV.IsNotEmpty()
  @CV.IsString()
  @CV.Length(1, 50)
  name!: string;

  @CV.IsString()
  @CV.IsOptional()
  @CV.Length(8, 128)
  password?: string;

  @CV.IsOptional()
  @CV.IsEnum(ChatRoomStatus)
  roomStatus?: ChatRoomStatus;
}
