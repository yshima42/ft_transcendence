import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatRoomDto {
  @IsNotEmpty()
  @IsString()
  name!: string;
}
