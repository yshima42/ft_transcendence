import { ChatRoomStatus } from '@prisma/client';
import * as CV from 'class-validator';

export class CreateChatRoomDto {
  @CV.IsNotEmpty()
  @CV.IsString()
  @CV.Length(1, 50)
  name!: string;

  @CV.IsNotEmpty()
  @CV.IsEnum(ChatRoomStatus)
  roomStatus!: ChatRoomStatus;

  @CV.IsString()
  @CV.IsOptional()
  @CV.MinLength(8)
  @CV.MaxLength(128)
  password?: string;
}
