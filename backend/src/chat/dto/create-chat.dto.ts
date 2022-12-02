import { ChatUserStatus } from '@prisma/client';
import { IsNotEmpty, IsString, IsUUID, IsEnum } from 'class-validator';

export class CreateChatRoomDto {
  @IsNotEmpty()
  @IsString()
  name!: string;
}

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  content!: string;

  @IsNotEmpty()
  @IsUUID()
  chatRoomId!: string;

  @IsNotEmpty()
  @IsUUID()
  senderId!: string;
}

export class CreateChatUserDto {
  @IsNotEmpty()
  @IsUUID()
  chatRoomId!: string;

  @IsNotEmpty()
  @IsUUID()
  userId!: string;

  @IsNotEmpty()
  @IsEnum(ChatUserStatus)
  status!: ChatUserStatus;
}
