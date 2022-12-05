import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateChatMessageDto {
  @IsNotEmpty()
  @IsString()
  content!: string;

  @IsNotEmpty()
  @IsUUID()
  chatRoomId!: string;
}
